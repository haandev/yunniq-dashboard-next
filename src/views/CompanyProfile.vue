<template>
  <div>
    <CAlert color="primary" v-if="status==='success'">
      Parola başarıyla değiştirildi.
    </CAlert>
    <CAlert color="danger" v-if="status==='not-match'">
      Parolalar eşleşmiyor.
    </CAlert>
    <CAlert color="danger" v-if="status==='not-correct'">
      Eski parolanızı hatalı girdiniz.
    </CAlert>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Firma Ayarlarınız</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>

              <CCol sm="12">
                <CInput
                  :value.sync="formData.company"
                  label="Firma Adı"
                  placeholder="Firma Adı"
                />
              </CCol>



            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  @click="save()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  @click="clean()"
                  size="sm"
                  variant="outline"
                  color="primary"
                  class="mr-1"
                  >Temizle</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

  </div>
</template>

<script>
export default {
  name: "Company",
  components: {},
  data() {
    return {
      status: "none",
      formData: {
        company:"",
        contact:"",
        logo:"",
        css:"",
        facebook:"",
        twitter:"",
        instagram:"",
        youtube:"",
        garson:"",
        vale:"",
        sikayet:"",
      },
    };
  },
  methods: {
    clean() {
      this.mode = "new";
      this.formData = {
        username: this.$store.state.user.username,
        confirm_password: "",
        password: "",
        old_password: "",
      };
      this.id = null;
    },
    save: function () {
      if (this.formData.password !== this.formData.confirm_password) {
        this.status = "not-match"
        return;
      }
      this.$axios
        .post(`/auth/password-change`, this.formData)
        .then((response) => {
          this.status = response.status === 200 && "success"
          this.clean();
        })
        .catch(({response}) => {
          this.status = response.status === 404 ? "not-found" : 'not-correct'
        });
    },
  },
  mounted() {
    const id = this.$store.state.user.companyId
    this.$axios
        .get(`/company/${id}`)
        .then(({data}) => {
          this.formData  = data
        })


  },
};
</script>
