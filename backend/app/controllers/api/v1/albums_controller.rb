class Api::V1::AlbumsController < ApplicationController
  def index
    @albums = Album.all
    render json: @albums
  end

  def songs
    @album = Album.find(params[:id])
    @songs = @album.songs
    render json: @songs
  end
end
