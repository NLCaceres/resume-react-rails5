class AddPostImagesCountToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :post_images_count, :integer
  end
end
