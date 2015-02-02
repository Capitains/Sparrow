<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:oa="http://www.w3.org/ns/oa#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:prov="http://www.w3.org/ns/prov#"
    xmlns:cnt="http://www.w3.org/2008/content#"
    version="1.0">
    
    <!-- this template transforms the output of a tokenization of text/plain
         text by the llt segtok service into a treebank annotation of the 
         specififed format. the annotation is then wrapped as in an OA container.
         
         parameters 
            e_docuri - uri of the document identifier that is the target of the 
                       annotation (i.e. the source of the tokenized text). If it contains a 
                       cts urn with a passage, the passage component will be extracted and 
                       used as the subdoc identifier for all the sentences
            e_format - format you want to use for the treebank file (e.g. 'aldt')
            e_lang   - language of the treebank file (e.g. 'grc','lat', etc.)
            e_agenturi - uri for the software agent that created the tokenization
            e_datetime - the datetime of the serialization
            e_collection - the urn of the CITE collection which the annotation is/will be a member of
    -->
    
    <xsl:param name="e_lang" select="'lat'"/>
    <xsl:param name="e_format" select="'aldt'"/>
    <xsl:param name="e_docuri" select="'urn:cts:latinLit:tg.work.edition:1.1'"/>
    <xsl:param name="e_agenturi" select="'http://services.perseids.org/llt/segtok'"/>
    <xsl:param name="e_appuri"/>
    <xsl:param name="e_datetime"/>
    <xsl:param name="e_collection" select="'urn:cite:perseus:lattb'"/>
    <xsl:param name="e_attachtoroot" select="true()"/>
    
    <xsl:output indent="yes"></xsl:output>
    <xsl:key name="segments" match="tei:w|tei:pc|w|pc" use="@s_n" />
    
    <xsl:template match="/">
        
        <!-- a hack to get a uuid for the body -->
        <xsl:variable name="bodyid" select="concat('urn:uuid',generate-id(//llt-segtok))"/>
        <xsl:element name="RDF" namespace="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
            <xsl:element name="Annotation" namespace="http://www.w3.org/ns/oa#">
                <xsl:element name="memberOf" xmlns="http://purl.org/dc/dcam/">
                    <xsl:attribute name="rdf:resource"><xsl:value-of select="$e_collection"/></xsl:attribute>
                </xsl:element>
                <xsl:element name="hasTarget" namespace="http://www.w3.org/ns/oa#">
                    <xsl:attribute name="rdf:resource"><xsl:value-of select="$e_docuri"/></xsl:attribute>
                </xsl:element>
                <xsl:element name="hasBody" namespace="http://www.w3.org/ns/oa#">
                    <xsl:attribute name="rdf:resource"><xsl:value-of select="$bodyid"/></xsl:attribute>
                </xsl:element>
                <!-- TODO this isn't the best motivation  we are going to need to subclass -->
                <xsl:element name="isMotivatedBy" namespace="http://www.w3.org/ns/oa#">
                    <xsl:attribute name="rdf:resource">oa:linking</xsl:attribute>
                </xsl:element>
                <xsl:element name="serializedBy" namespace="http://www.w3.org/ns/oa#">
                    <xsl:element name="SoftwareAgent" namespace="http://www.w3.org/ns/prov#">
                        <xsl:attribute name="rdf:about"><xsl:value-of select="$e_agenturi"/></xsl:attribute>
                    </xsl:element>
                </xsl:element>
                <xsl:element name="serializedAt" namespace="http://www.w3.org/ns/oa#"><xsl:value-of select="$e_datetime"/></xsl:element>
            </xsl:element>
            <xsl:element name="ContentAsXML" namespace="http://www.w3.org/ns/oa#">
                <xsl:attribute name="rdf:about"><xsl:value-of select="$bodyid"/></xsl:attribute>
                <xsl:element name="cnt:rest">
                    <xsl:attribute name="rdf:parseType">Literal</xsl:attribute>
                    <xsl:element name="treebank">
                        <xsl:attribute name="xml:lang">
                            <xsl:choose>
                                <xsl:when test="//tei:text[@xml:lang]"><xsl:value-of select="//tei:text/@xml:lang"/></xsl:when>
                                <xsl:otherwise><xsl:value-of select="$e_lang"/></xsl:otherwise>
                            </xsl:choose>
                        </xsl:attribute>
                        <xsl:attribute name="format"><xsl:value-of select="$e_format"/></xsl:attribute>
                        <xsl:attribute name="version">1.5</xsl:attribute>
                        <xsl:element name="annotator">
                            <xsl:element name="short"/>
                            <xsl:element name="name"/>
                            <xsl:element name="address"/>
                            <xsl:element name="uri"><xsl:value-of select="$e_agenturi"/></xsl:element>
                        </xsl:element>
                        <xsl:if test="$e_appuri">
                            <xsl:element name="annotator">
                                <xsl:element name="short"/>
                                <xsl:element name="name"/>
                                <xsl:element name="address"/>
                                <xsl:element name="uri"><xsl:value-of select="$e_appuri"/></xsl:element>
                            </xsl:element>
                        </xsl:if>
                        <xsl:apply-templates/>
                    </xsl:element>
                </xsl:element>
            </xsl:element>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="llt-segtok">
        <xsl:variable name="subdoc">
            <xsl:choose>
                <xsl:when test="contains($e_docuri,'urn:cts:')">
                    <!-- extract the passage component it's the substring after the 4th ':' -->
                    <!-- but note this breaks if individual parts of the urn are namespaced separately from the whole -->
                    <xsl:value-of select="substring-after(substring-after(substring-after($e_docuri,'urn:cts:'),':'),':')"/>
                </xsl:when>
                <xsl:otherwise/>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="doc">
            <xsl:choose>
                <xsl:when test="contains($e_docuri,'urn:cts:') and $subdoc != ''">
                    <!-- extract the passage component it's the substring after the 4th ':' -->
                    <!-- but note this breaks if individual parts of the urn are namespaced separately from the whole -->
                    <xsl:value-of select="substring-before($e_docuri,concat(':',$subdoc))"/>
                </xsl:when>
                <xsl:otherwise><xsl:value-of select="$e_docuri"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:for-each select="//*[generate-id()=generate-id(key('segments',@s_n)[1])]">
            <xsl:variable name="num" select="@s_n"/>
            <xsl:element name="sentence">
                <xsl:attribute name="id"><xsl:value-of select="@s_n"/></xsl:attribute>
                <xsl:attribute name="document_id"><xsl:value-of select="$doc"/></xsl:attribute>
                <xsl:attribute name="subdoc"><xsl:value-of select="$subdoc"/></xsl:attribute>
                <xsl:attribute name="span"/>
                <xsl:apply-templates select="//*[@s_n=$num]"></xsl:apply-templates>
            </xsl:element>
            
        </xsl:for-each>
        
    </xsl:template>


    <xsl:template match="tei:w|w">

        <xsl:variable name="lang">
            <xsl:choose>
                <xsl:when test="//tei:text/@xml:lang"><xsl:value-of select="//tei:text/@xml:lang"/></xsl:when>
                <xsl:otherwise><xsl:value-of select="$e_lang"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:element name="word">
            <xsl:attribute name="id"><xsl:value-of select="@n"></xsl:value-of></xsl:attribute>
            <xsl:attribute name="form"><xsl:value-of select="."/></xsl:attribute>
            <xsl:attribute name="lemma"/>
            <xsl:attribute name="postag"/>
            <xsl:attribute name="head">
            <xsl:choose>
                <xsl:when test="$e_attachtoroot and $e_attachtoroot != ''">0</xsl:when>
                <xsl:otherwise></xsl:otherwise>
            </xsl:choose>
            </xsl:attribute>
            <xsl:attribute name="relation">nil</xsl:attribute>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="tei:pc|pc">
        <xsl:variable name="s" select="@s_n"/>
        <xsl:variable name="isComma" select=". = ','"/>
        <xsl:element name="word">
            <xsl:attribute name="id"><xsl:value-of select="@n"></xsl:value-of></xsl:attribute>
            <xsl:attribute name="form"><xsl:value-of select="."/></xsl:attribute>
            <xsl:attribute name="lemma">punc1</xsl:attribute>
            <xsl:attribute name="postag">u--------</xsl:attribute>
            <xsl:attribute name="head">
                <xsl:choose>
                    <xsl:when test="not($isComma) and $e_attachtoroot and $e_attachtoroot != ''">0</xsl:when>
                    <xsl:otherwise></xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:choose>
                <!-- RGorman says we always want AuxX for commas -->
                <xsl:when test="$isComma">
                    <xsl:attribute name="relation">AuxX</xsl:attribute>
                </xsl:when>
                <!-- if punctuation is mid-sentence-->
                <xsl:when test="following-sibling::*[@s_n=$s]">
                    <xsl:attribute name="relation">AuxX</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="relation">AuxK</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="@*"/>

    <xsl:template match="*"/>
    
</xsl:stylesheet>