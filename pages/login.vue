<template>
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
</template>

<script setup>
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

<style>
.min-50vh{
  min-height: 50vh;
}
</style>