class ChromiumKiosk < FPM::Cookery::Recipe
  homepage 'https://www.chromium.org'

  section 'Utilities'
  name 'AptiDemo-Chromium-kiosk'
  version '0.5.0'
  description 'Chromium profiles for Aptivate demo appliance'
  revision 0
  vendor 'aptivate'
  maintainer '<adrians@aptivate.org>'
  license 'MIT License'

  source '', :with => :noop

  platforms [:ubuntu] do
    depends 'chromium-browser'
  end

  def build
    # Nothing
  end

  def install
    (opt/'aptivate-demo/chromium-profile').mkdir
    cp_r Dir[workdir('chromium-profile/*')],
         opt('aptivate-demo/chromium-profile').to_s
    chmod_R "go+rX", opt('aptivate-demo/chromium-profile')

    bin.install workdir('aptivate-demo-launcher')
    share('applications').install workdir('aptivate-demo-launcher.desktop')
  end
end
