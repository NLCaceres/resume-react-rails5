# Quick and nifty way to update counters if they're added to model!
desc 'Update counters!'
task :update_counters do
  Post.find_each { |post| Post.reset_counters(post.id, :post_images) }
end