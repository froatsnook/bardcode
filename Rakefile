########
# Dist #
########

WEB_HEADER = <<EOF
/**
 * bardcode v#{/version: "(.*)"/.match(File.read("package.js"))[1]}
 * https://github.com/froatsnook/bardcode
 * (c) 2015 froatsnook
 * bardcode may be freely distributed under the MIT license.
 */
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

######################
# Demos for gh-pages #
######################

namespace :demos do
  desc "start demo sever"
  task :server do
    Dir.chdir("demos") do
      sh "python -m http.server"
    end
  end

  desc "start demo sever (in gh-pages)"
  task :outserver do
    Dir.chdir("gh-pages") do
      sh "python -m http.server"
    end
  end

  desc "watch for changes, building demo sources"
  task :watch do
    sh "jsx --harmony --watch demos gh-pages"
  end

  desc "build demo sources"
  task :build do
    sh "rm -rf gh-pages"
    sh "mkdir gh-pages"
    sh "cp demos/*.{css,html} gh-pages"
    sh "jsx --harmony demos gh-pages"
    sh "sed -i'' 's/react\.js/react\.min\.js/' gh-pages/index.html"
    sh "sed -i'' 's/.*JSXTransformer.*//' gh-pages/index.html"
    sh "sed -i'' 's/jsx/javascript/' gh-pages/index.html"
  end
end

########
# Lint #
########
desc "Lint javascript files"
task :lint do
  sh "eslint lib"
end

#########
# Clean #
#########

desc "Clean temporary files"
task :clean do
  sh "rm -rf dist"
end

