class ChromiumKiosk < FPM::Cookery::Recipe
  homepage 'https://www.chromium.org'

  section 'Utilities'
  name 'AptiDemo-Chromium-kiosk'
  version '1.0.0'
  description 'Chromium profiles for Aptivate demo appliance'
  revision 2
  vendor 'aptivate'
  maintainer '<adrians@aptivate.org>'
  license 'MIT License'
  arch 'all'

  source '', :with => :noop

  platforms [:ubuntu] do
    depends 'chromium-browser'
  end

  def build
    # Nothing
  end

  def install
    (opt/'aptivate-demo/chromium-profile').mkdir
    (opt/'aptivate-demo/static-slides').mkdir
    cp_r Dir[workdir('chromium-profile/*')],
         opt('aptivate-demo/chromium-profile').to_s
    chmod_R "go+rX", opt('aptivate-demo/chromium-profile')
    cp_r Dir[workdir('static-slides/*')],
         opt('aptivate-demo/static-slides').to_s

    bin.install workdir('aptivate-demo-launcher')
    bin.install workdir('aptivate-vagrant-up')
    bin.install workdir('aptivate-vagrant-box-reload')
    share('applications').install workdir('aptivate-demo-launcher.desktop')
  end
end
