<template>
    <div class="container-fluid authentication-bg overflow-hidden">
        <div class="bg-overlay"></div>
        <div class="row align-items-center justify-content-center min-vh-100">
            <div class="col-10 col-md-6 col-lg-4 col-xxl-3">
                <div class="card mb-0">
                    <div class="card-body">
                        <div class="text-center">
                            <a href="index.html" class="logo-dark">
                                <div class="d-flex align-items-center justify-content-center">
                                    <img src="assets/icons/icon-512x512.png" alt="" height="20" class="auth-logo logo-dark me-2"><b class="text-24">Senyaman</b>
                                </div>
                            </a>
                            <h4 class="mt-4">Welcome Back !</h4>
                            <p class="text-muted">Sign in to continue to Senyaman.</p>
                        </div>

                        <div class="p-2 mt-5">
                            <form class="" @submit.prevent="signIn">
                                <div class="input-group auth-form-group-custom mb-3">
                                    <span class="input-group-text bg-primary bg-opacity-10 fs-16 " id="basic-addon1"><i class="mdi mdi-email auti-custom-input-icon"></i></span>
                                    <input type="text" class="form-control" placeholder="Enter username" aria-label="Username" aria-describedby="basic-addon1" v-model="email">
                                </div>

                                <div class="input-group auth-form-group-custom mb-3">
                                    <span class="input-group-text bg-primary bg-opacity-10 fs-16" id="basic-addon2"><i class="mdi mdi-lock-outline auti-custom-input-icon"></i></span>
                                    <input :type="inputType" class="form-control" id="userpassword" placeholder="Enter password" aria-label="Username" aria-describedby="basic-addon1" v-model="password">
                                    <a href="#" class="input-group-text bg-primary bg-opacity-10 fs-16" id="basic-addon2" data-password="false" data-bs-toggle="password" @click="togglePassword"><i class="mdi mdi-eye-outline auti-custom-input-icon"></i></a>
                                </div>

                                <div class="mb-sm-5">
                                    <div class="form-check float-sm-start">
                                        <input type="checkbox" class="form-check-input" id="customControlInline">
                                        <label class="form-check-label" for="customControlInline">Remember me</label>
                                    </div>
                                    <div class="float-sm-end">
                                        <a href="auth-recoverpw.html" class="text-muted"><i class="mdi mdi-lock me-1"></i> Forgot your password?</a>
                                    </div>
                                </div>

                                <div class="pt-3 text-center">
                                    <button class="btn btn-primary w-xl waves-effect waves-light" type="submit">Log In</button>
                                </div>
                                <div class="text-center p-3 text-danger">{{ error }}</div>
                                <div class="mt-3 text-center">
                                    <p class="mb-0">Don't have an account ? <a href="auth-register.html" class="fw-medium text-primary"> Register </a> </p>
                                </div>
                            </form>
                        </div>

                        <div class="mt-5 text-center">
                            <p>©{{ year }} Senyaman. Crafted with <i class="mdi mdi-heart text-danger"></i> by Senyaman.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 
    <div>
        <div class="d-flex justify-content-center align-items-center w-100 min-50vh">
            <div class="w-50">
            <h3>Login</h3>
            <div>
                <form  @submit.prevent="signIn">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" v-model="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" v-model="password" required>
                    </div>
                    <button class="btn btn-primary">Login</button>
                </form>
            </div>
            </div>
        </div>
    </div>
     -->
</template>

<script setup>
    import { useAuthStore } from "~/stores/auth";
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const email = ref('');
    const password = ref('');
    const year = new Date().getFullYear();
    const error = ref('');
    const inputType = ref('password');
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
                window.location.href = '/room';
            }else{
                error.value = response.message;
            }
            
        })
    }

    function togglePassword(){
        if(inputType.value == 'password'){
            inputType.value = 'text';
        }else{
            inputType.value = 'password';
        }
    }
    definePageMeta({
        layout: 'login'
        })
</script>

<style>
.min-50vh{
  min-height: 50vh;
}
</style>