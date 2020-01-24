class User::PostImagesController < ApplicationController

  http_basic_authenticate_with name: "guest", password: "guest", only: :destroy

  def create
    @post = Post.find(params[:post_id])
    @post_image = @post.post_images.create(image_params)
    redirect_to post_path(@post)
  end

  def destroy
    @post = Post.find(params[:post_id]) #Find a corresponding post
    @post_image = @post.post_images.find(params[:id]) # Find its image within the post images arr
    @post_image.destroy
    redirect_to post_path(@post)
  end

  private
  def image_params
    params.require(:post_image).permit(:image_url, :alt_text)
  end
end
