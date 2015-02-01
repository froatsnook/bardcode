########
# Dist #
########
#
WEB_HEADER = <<EOF
;(function() {
var drawBarcode;
var bardcode;
EOF

WEB_FOOTER = <<EOF
window.drawBarcode = drawBarcode;
})();
EOF

NPM_HEADER = <<EOF
var drawBarcode;
var bardcode;
EOF

NPM_FOOTER = <<EOF
module.exports = bardcode;
EOF

desc "Build web version"
task :dist do
  sh "rm -rf dist"
  sh "mkdir dist"

  files = Dir.glob("lib/*.js")
  files.sort!

  sh "touch dist/bardcode.js"
  File.open("dist/bardcode.js", "w") do |f|
    # Write the header.
    f.write(WEB_HEADER)

    # Concatenate all source files.
    files.each do |jsfile|
      js = File.read(jsfile)
      f.write(js)
    end

    # Write the footer.
    f.write(WEB_FOOTER)
  end

  File.open("dist/index.js", "w") do |f|
    # Write the header.
    f.write(NPM_HEADER)

    # Concatenate all source files.
    files.each do |jsfile|
      js = File.read(jsfile)
      f.write(js)
    end

    # Write the footer.
    f.write(NPM_FOOTER)
  end

  # Minify web js
  sh "./node_modules/.bin/uglifyjs --mangle --screw-ie8 dist/bardcode.js -o dist/bardcode.min.js"
end

#########
# Clean #
#########

desc "Clean temporary files"
task :clean do
  sh "rm -rf dist"
end

