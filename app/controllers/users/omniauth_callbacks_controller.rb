module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def facebook
      omniauth = Users::Omniauth.new(request.env["omniauth.auth"])

      @user = omniauth.find_or_create!

      if @user.persisted?
        sign_in_and_redirect @user, event: :authentication
        set_flash_message(:notice, :success, kind: 'Facebook') if is_navigational_format?
      else
        session['devise.facebook_data'] = request.env['omniauth.auth'].except(:extra)
        redirect_to new_user_registration_url
      end
    end

    def failure
      redirect_to root_path
    end
  end
end
