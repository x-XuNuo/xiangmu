import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login/Login.vue"
import Home from "./views/Home/Home.vue"
import User from "./views/User/User.vue"
import Roles from "./views/Roles/Roles.vue"
import Rights from "./views/Rights/Rights.vue"
import Goods from "./views/Goods/Goods.vue"

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path : "/login",
      component : Login
    },
    {
      path : "/home",
      component : Home,
      children : [
        {
          // 如果给path加上/  变成/user   那么访问的时候直接 使用 /user
          // 如果不加/  那么访问的时候直接  /home/user
          path : "/users",
          component : User
        },
        {
        path : "/roles",
        component : Roles
      },
      {
        path : "/rights",
        component : Rights
      },
      {
        path : "/goods",
        component :Goods
      }
      ],
    },
    {
      path : "/",
      redirect : "/home"
    },
  ]
});


// 注册一个导航守卫
router.beforeEach((to, from, next) => {
  
  // 1.判断用户访问的是不是登录页面,如果是登录页面，直接放行
  if (to.path === "/login") {
    
    next();
    return;
  }
  // 2. 如果访问的是其他的页面，判断用户是否进行了登录
  //    2.1 如果登录了，那就直接放行
  //    2.2 如果没登录，那就跳转到登录页

  if (localStorage.getItem("token")) {
    next();
  } else {
    router.push("/login")
  }
});

export default router