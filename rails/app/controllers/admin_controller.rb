class Admin::AdminController < ApplicationController
	before_filter :authenticate

	protected
	def authenticate
		authenticate_or_request_with_http_basic do |username,password|
			username == "admin" && password == "3petitsc"
		end
	end
end
