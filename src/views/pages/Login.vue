<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Giriş</h1>
                  <p class="text-muted">Yönetici parolanız ile giriş yapın</p>
                  <CInput
                    placeholder="Kullanıcı Adı"
                    autocomplete="username email"
                    :value.sync="username"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Parola"
                    :value.sync="password"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="login"
                        >Giriş</CButton
                      >
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0"
                        >Parolamı Unuttum</CButton
                      >
                      <CButton color="link" class="d-lg-none"
                        >Yönetici Değilim</CButton
                      >
                    </CCol>
                  </CRow>
                  <CRow class="mt-4">
                    <CCol col="12">
                      <CAlert v-if="error" color="danger">{{ error }}</CAlert>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Temsilci Ol</h2>
                <p>
                  Hemen bizimle iletişime geçerek işletmen için QR Kodlu menü yaratabilirsin.
                </p>
                <a href="tel:+905412769700"><CButton color="light" variant="outline" size="lg">
                  Hemen Ara
                </CButton></a>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: "",
      timeoutId: null,
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "Dashboard" });
        })
        .catch((err) => {
          this.error = err.response.data || "Kullanıcı Adı veya Şifre Yanlış";

          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
          }

          this.timeoutId = setTimeout(() => (this.error = ""), 5000);
        });
    },
  },
};
</script>
