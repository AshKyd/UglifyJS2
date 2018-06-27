var fs = require("fs");
new Function(
  "MOZ_SourceMap",
  "exports",
  (function() {
    var code = [
      fs.readFileSync(__dirname + "/../lib/utils.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/ast.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/parse.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/transform.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/scope.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/output.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/compress.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/sourcemap.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/mozilla-ast.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/propmangle.js", "utf8"),
      fs.readFileSync(__dirname + "/../lib/minify.js", "utf8"),
      fs.readFileSync(__dirname + "/exports.js", "utf8")
    ];
    code.push("exports.describe_ast = " + describe_ast.toString());
    return code.join("\n\n");
  })()
)(require("source-map"), exports);

function describe_ast() {
  var out = OutputStream({ beautify: true });
  function doitem(ctor) {
    out.print("AST_" + ctor.TYPE);
    var props = ctor.SELF_PROPS.filter(function(prop) {
      return !/^\$/.test(prop);
    });
    if (props.length > 0) {
      out.space();
      out.with_parens(function() {
        props.forEach(function(prop, i) {
          if (i) out.space();
          out.print(prop);
        });
      });
    }
    if (ctor.documentation) {
      out.space();
      out.print_string(ctor.documentation);
    }
    if (ctor.SUBCLASSES.length > 0) {
      out.space();
      out.with_block(function() {
        ctor.SUBCLASSES.forEach(function(ctor, i) {
          out.indent();
          doitem(ctor);
          out.newline();
        });
      });
    }
  }
  doitem(AST_Node);
  return out + "\n";
}

function infer_options(options) {
  var result = exports.minify("", options);
  return result.error && result.error.defs;
}

exports.default_options = function() {
  var defs = {};
  Object.keys(infer_options({ 0: 0 })).forEach(function(component) {
    var options = {};
    options[component] = { 0: 0 };
    if ((options = infer_options(options))) {
      defs[component] = options;
    }
  });
  return defs;
};
