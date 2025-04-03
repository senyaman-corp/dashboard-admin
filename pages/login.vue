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
                    <input type="checkbox" class="form-check-input" id="customControlInline">
                    <label class="form-check-label" for="customControlInline">Remember me</label>
                  </div>
                  <div class="float-sm-end">
                    <a href="auth-recoverpw.html" class="text-muted">
                      <i class="mdi mdi-lock me-1"></i> Forgot your password?
                    </a>
                  </div>
                </div>
                <div class="pt-5 text-center">
                  <button class="btn btn-primary w-xl waves-effect waves-light" type="submit">Log In</button>
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
    import { ref, onMounted } from 'vue';
    import { useAuthStore } from "~/stores/auth";

    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const email = ref('');
    const password = ref('');
    onMounted(() => {
        authStore.setLoggedin(false);
        authStore.setToken(null);
    })

    function signIn(){
        const formData = new FormData();
        formData.append('email',email.value);
        formData.append('password',password.value);
        $fetch(`${config.public.dashboardUrl}api/login`,{
            method:'POST',
            lazy: true,
            body:formData
        }).then(response=>{
            if(response.status ==1){
                authStore.setToken(response.data);
                authStore.setLoggedin(true);
                window.location.href = '/';
            }else{
                //alert login gagal
            }
            
        })
    }
    definePageMeta({
        layout: 'login'
    })
</script>