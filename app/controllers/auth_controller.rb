class AuthController < ApplicationController
  
# curl --data "param1=value1&param2=value2" -H 'test_header: 1234' http://localhost:3000/auth.json

  def create_session
    email = params[:email]
    password = params[:password]
    if request.format != :json
      render :status=>406, :json=>{:message=>"The request must be json"}
      return
     end

  if email.nil? or password.nil?
     render :status=>400,
            :json=>{:message=>"The request must contain the user email and password."}
     return
  end

  @user=User.find_by_email(email.downcase)

  if @user.nil?
    logger.info("User #{email} failed signin, user cannot be found.")
    render :status=>401, :json=>{:message=>"Invalid email or passoword."}
    return
  end

  # http://rdoc.info/github/plataformatec/devise/master/Devise/Models/TokenAuthenticatable
  @user.ensure_authentication_token!

  if not @user.valid_password?(password)
    logger.info("User #{email} failed signin, password \"#{password}\" is invalid")
    render :status=>401, :json=>{:message=>"Invalid email or password."}
  else
    puts 'login successful'
    render :status=>200, :json=>{:token=>@user.authentication_token}
  end
end

#  # POST /auth.json
#  def create_session
#    if params[:username] == 'andy' && params[:password] == 'xxx'
#      message = ''
#      success = true,
#      token = '1234'
#        render json: { :token => token, :success => success, :token => token }
#    else
#      puts 'got here'
#      head :unauthorized
#    end    
#  end

end