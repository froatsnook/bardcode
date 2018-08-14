########
# Dist #
########

desc "Prepare for dist"
task :dist do
  sh "rm -rf dist"
  sh "mkdir dist"

  sh "npm run build"
  sh "npm run buildes"
  sh "npm run minify"
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

