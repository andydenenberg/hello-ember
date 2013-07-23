class AuthController < ApplicationController
  
# curl --data "param1=value1&param2=value2" -H 'test_header: 1234' http://localhost:3000/auth.json

  # POST /auth.json
  def create_session
    if params[:username] == 'andy' && params[:password] == 'xxx'
      message = ''
      success = true,
      token = '1234'
        render json: { :token => token, :success => success, :token => token }
    else
      puts 'got here'
      head :unauthorized
    end    
  end

end