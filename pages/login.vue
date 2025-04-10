<template>
  <div class="container-fluid authentication-bg overflow-hidden">
    <div class="bg-overlay"></div>
    <div class="row align-items-center justify-content-center min-vh-100">
      <div class="col-10 col-md-6 col-lg-4 col-xxl-3">
        <CardBaseCard>
          <template #default>
            <div class="text-center">
              <h4 class="text-muted">Sign in to SENYAMAN</h4>
            </div>
            <div class="p-2 mt-4">
              <FormBaseForm @submit="signIn">
                <InputBaseInput
                  type="email"
                  v-model="email"
                  label="Email"
                  id="email"
                  placeholder="Enter email"
                  required
                />
                <InputBaseInput
                  type="password"
                  v-model="password"
                  label="Password"
                  id="password"
                  placeholder="Enter password"
                  required
                />
                <div class="mb-sm-5">
                  <div class="form-check float-sm-start">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="customControlInline"
                      v-model="remember_me"
                    />
                    <label class="form-check-label" for="customControlInline"
                      >Remember me</label
                    >
                  </div>
                  <div class="float-sm-end">
                    <a href="auth-recoverpw.html" class="text-muted">
                      <i class="mdi mdi-lock me-1"></i> Forgot your password?
                    </a>
                  </div>
                </div>
                <div class="error">{{error}}</div>
                <div class="pt-5 text-center">
                  <button
                    class="btn btn-primary w-xl waves-effect waves-light"
                    type="submit"
                  >
                    Log In
                  </button>
                </div>
              </FormBaseForm>
            </div>
          </template>
        </CardBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const remember_me = ref(false);
const year = new Date().getFullYear();
const error = ref("");
const inputType = ref("password");
const router = useRouter();
const { $bus } = useNuxtApp();
function signIn() {
  $bus.$emit('loading',true)
  const formData = new FormData();
  formData.append("email", email.value);
  formData.append("password", password.value);
  $fetch(`${config.public.dashboardUrl}api/login`, {
    method: "POST",
    lazy: true,
    body: formData,
  }).then((response) => {
    $bus.$emit('loading',false)
    if (response.status == 1) {
      authStore.setToken(response.data.token);
      authStore.setUser(response.data.user);
      authStore.setLoggedin(true);
     if(remember_me.value){
        authStore.setEmail(email.value);
        authStore.setPassword(password.value);
        
     }
     if(authStore.isAuthorized('Front Office')){
      navigateTo('/room');
     }else if(authStore.isAuthorized('Housekeeping')){
        navigateTo('/housekeeping/rooms');
     }else if(authStore.isAuthorized('Admin')){
        navigateTo('/room');
     }
    } else {
      error.value = response.message;
    }
  });
}

function togglePassword() {
  if (inputType.value == "password") {
    inputType.value = "text";
  } else {
    inputType.value = "password";
  }
}
definePageMeta({
  layout: "login",
});
</script>
