class Api::V1::AlbumsController < ApplicationController
  def index
    @albums = Album.all.order(:id)
    render json: @albums
  end

  def show
    @album = Album.find(params[:id])
    render json: @album
  end

  def songs
    @album = Album.find(params[:id])
    @songs = @album.songs
    render json: @songs
  end
end
