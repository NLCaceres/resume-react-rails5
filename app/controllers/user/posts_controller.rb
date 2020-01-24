class User::PostsController < ApplicationController

  http_basic_authenticate_with name: "guest", password: "guest", except: [:index, :show] # Only allow the right users!

  def index
    @posts = Post.all
  end

  def new
    @post = Post.new
  end

  def show
    begin
      @post = Post.find(params[:id]) # Another bonus of using instance vars is that Rails will pass it to the view!
    rescue ActiveRecord::RecordNotFound # If nothing found, then redirect back home!
      redirect_to user_posts_path
    end
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
    @post = Post.find(params[:id])
    if @post.update(post_params)
      redirect_to [:user, @post.show]
    else
      render 'edit'
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    redirect_to user_posts_path
  end

  def create # Render is a method (ruby specifies params like a kotlin infix fun) # It also just shows plaintext at this create path
    # render plain: params[:post].inspect # varName followed by colon is the ruby way of making a key point to a value (in this case a key/symbol/string to a method - params)
    # @post = Post.new(params[:post]) # Variables that start with @ are instance vars accesible to entire class # Ruby classes are ALWAYS capital so Post refers to the class
    # The above doesn't actually work! It would be convenient for rails to easily and quickly assign the params to the model, 
    # but it doesn't and would be a security risk in its present form # Instead we do it manually with the require and permit methods specifying the fields from model
    # @post = Post.new(params.require(:post).permit(:title, :text)) # Proper but not common usage of require/permit
    @post = Post.new(post_params) # Common usage! Pass in a method that returns your params!
    if @post.save # returns true if successful (also does saving while it's at it)
      redirect_to [:user, @post]
    else 
      render 'new'
    end
  end

  private # All methods past this point get marked private!
  def post_params
    params.require(:post).permit(:title, :description, :github_url)
  end
end
