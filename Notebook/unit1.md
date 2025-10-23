### Importants Commands:-

# check prerequirment
-- node -v
-- npm -v

# install CLIs (use npx if you prefer not to install golbally)
npm install -g @ionnic/cli @angular/cli
# or use: npx ionix start...if you didn't install globally.


# create app (Angular Flavor)
-- ionic start myIonicApp blank --type=angular

cd myIonicApp

# run in browser(dev server)
ionic server

# build for production
ionic build



# add native platform via capacitor(Android example)
npx cap add android
ionic build
npx cap copy
npx cap open android


# live reload on device(with android)
ionic capacitor run android -l --external







### What is ionic?
-- ui toolkit(means its provide collection of readymade user interface component like buttons, cards modals etc) and framework(tool,library,structure,js framwork ike angular,ract vue)
-- it has own CLI(command line interface to generate code ,running apps and packaging them).



# Apps are built as web apps, then wrapped for native functionality using a runtime (modern: Capacitor, formerly: Cordova):- 

-- when we make appin ionic then we make webapp using html css and javascript just like the normal website. but when we want to run those in mobile app store then we haveto make that website in native app(android/ios)

-- so here cordova(old) and capacitor(new) just act like a bridge..
basically  what it does:
- it pack those web app into native wrapper with the helpof this those appinstall in the mobile like normal app


### summany: ionic is like combo of ui toolkit and framework for building mobiles app using web tech.using capcitor and cordova




### The Ionic Platfrom--
