<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <root>
      <xsl:for-each select="root/foo">
        <foo><xsl:value-of select="bar"/></foo>
      </xsl:for-each>
    </root>
  </xsl:template>
</xsl:stylesheet>