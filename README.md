#### What savage does:

Parses svg shapes into objects that can be rendered on canvas.

Supported shapes: rect, circle, ellipse, polygon, path, polyline, glyph
Supported transform commands: matrix

Note: It only supports SVG files created with Adobe Illustrator - SVG properties as attributes

#### Usage:

```javascript
var savage = Savage.Parser.parse(svg); 
savage.render(context);
```

Parsing and rendering single nodes:

```javascript
var savage = new Savage.object();
var parsedElement = Savage.Parser.parseElement(svgNode); // converts svg node into a Savage.element
savage.add(parsedElement);
savage.x = 100;
savage.y = 200;
savage.render(context); // render object
```
