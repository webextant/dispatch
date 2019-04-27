<br>
<img src="http://www.webextant.com/img/webextant_logo_white.png" style="filter:invert(1)" width="200">

# Webextant | Dispatch

This codebase was built with Vue.js `2.6.10` using the standard tooling for Vue.js development (Vue CLI). The project demonstrates usage of the most important aspect of this repository which are the components. Two components have been built out. They are named `Component1.vue` and `Component2.vue`. They can be found within the `/app/src/components` folder. The components provide the necessary UI to communicate with the Webextant Dispatch API. 
***

## ⚙️ Components
- `/app/src/components/Component1.vue`
- `/app/src/components/Component2.vue`
***

## 📝 Notes
Inside `/app/public/index.html` the Bootstrap 3.3 UI framework (`v3.3.7`) and Bootstrap required dependency jQuery are added into the `<header>`. 

The project is making HTTP client requests to the Webextant Dispatch API using the popular libary called `axios` which is installed to the project as an import. To provide clean user alerts another popular library named `sweetalert2` was imported.

__Important Note:__ `Component1.vue` takes a prop named `dockId` that must be passed into the component to make sure `dockId` value is made available. `Component2.vue` takes a prop named `trailer` which is the trailer object obtained from the Webextant Dispatch API.

__Example usage of passing the `dockId` prop to `Component1.vue`__

```html

<Component1 :dockId="dockId"></Component1>

```

__Example usage of passing the `trailer` prop to `Component2.vue`__

```html

<Component2 :trailer="trailer"></Component2>

```
***

## 👨‍💻 Webextant Dispatch API Wrapper Library
To keep things elegant an API wrapper has been created to assist with making API calls to various Webextant Dispatch API resources. The library can be found in `/app/tools/webextant/dispatch/index.js`. This library exposes an exported class named `WebextantDispatchAPIWrapper`. When this class is instantiated the library exposes various API methods making API requests simple & hassle-free. The library uses the `axios` HTTP client to make these HTTP calls. The `WebextantDispatchAPIWrapper` takes no constructor arguments and currently exposes the following API helper methods.

- `SearchByTrailerNumber(payload, callback)`
- `CallTrailersToDock(payload, callback)`
- `ListAllDocks(payload, callback)`
- `CallTrailerOutOfDock(payload, callback)`

If the method is a POST then the `payload` argument is the POST body. The second argument `callback` uses standard `function(error, response){}` callback format. If the request fails you will get an `error`. If successful the `response` will be returned with the API reponse data. 

__Example usage of this class__

```javascript

import WebextantDispatchAPIWrapper from '../tools/webextant/dispatch'

const api = new WebextantDispatchAPIWrapper();

// Here is example of calling the SearchByTrailerNumber method resource

api.SearchByTrailerNumber({
    'TrailerNumber': self.searchQuery
}, (error, response) => {
    if(!error){
        console.log(response);
    } else {
        console.log(error);
    }
});

```