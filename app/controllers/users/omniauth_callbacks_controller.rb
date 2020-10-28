module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def facebook
      handle_authentication_for('facebook')
    end

    def google_oauth2
      handle_authentication_for('google')
    end

    def failure
      redirect_to root_path
    end

    private

    def handle_authentication_for(provider)
      omniauth = Users::Omniauth.new(request.env["omniauth.auth"])

      @user = omniauth.find_or_create!

      if @user.persisted?
        sign_in_and_redirect @user, event: :authentication
        set_flash_message(:notice, :success, kind: provider.capitalize) if is_navigational_format?
      else
        session["devise.#{provider}_data"] = request.env['omniauth.auth'].except(:extra)
        redirect_to new_user_registration_url
      end
    end
  end
end
