import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract styles
styles = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)
if styles:
    with open("css/style.css", "w", encoding="utf-8") as f:
        f.write("\n".join(styles))
    html = re.sub(r'<style>.*?</style>\n*', '', html, flags=re.DOTALL)
    
    # Add link to CSS before </head>
    html = html.replace('</head>', '    <link rel="stylesheet" href="css/style.css">\n</head>')

# Extract the main script. Ignore external script tags.
scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
if scripts:
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write("\n".join(scripts))
    html = re.sub(r'<script>.*?</script>\n*', '', html, flags=re.DOTALL)
    
    # Add script tag before </body>
    html = html.replace('</body>', '    <script src="js/app.js"></script>\n</body>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Extraction complete.")
