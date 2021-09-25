<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Free Lig</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.hostColor"
                  label="Ev Sahibi Renk"
                  :options="
                    colors.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.guestColor"
                  label="Rakip Renk"
                  :options="
                    colors.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  :value.sync="formData.winPoint"
                  label="Kazanma Puanı"
                  placeholder="Kazanma Puanı"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  :value.sync="formData.losePoint"
                  label="Kaybetme Puanı"
                  placeholder="Kaybetme Puanı"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  :value.sync="formData.provinceId"
                  label="İl"
                  :options="
                    provinces.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))
                  "
                />
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="mode !== 'new'"
                  @click="update(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="create()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
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
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-grid" />
              Free Lig Renkleri
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="freeLeagueColors"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'hostColor',
                  label: 'Ev Sahibi Renk',
                },
                {
                  key: 'guestColor',
                  label: 'Rakip Renk',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'winPoint',
                  label: 'Kazanma Puanı',
                },
                {
                  key: 'losePoint',
                  label: 'Kaybetme Puanı',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #province="{ item }">
                <td>{{ item.province.name }}</td>
              </template>
              <template #hostColor="{ item }">
                <td>{{ colors.find((c) => c.id === item.hostColor).name }}</td>
              </template>
              <template #guestColor="{ item }">
                <td>{{ colors.find((c) => c.id === item.guestColor).name }}</td>
              </template>
              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="edit(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle
                  </CButton>
                  <CButton
                    @click="remove(item.id)"
                    size="sm"
                    variant="outline"
                    color="danger"
                    >Sil</CButton
                  >
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
export default {
  name: "Leagues",
  components: {},
  data() {
    return {
      mode: "new",
      provinces: [
        {
          id: "loading",
          name: "İller Yükleniyor",
        },
      ],
      colors: [
        { id: "", name: "Renk Seçilmedi" },
        { id: "yesil", name: "Yeşil" },
        { id: "kirmizi", name: "Kırmızı" },
        { id: "siyah", name: "Siyah" },
      ],
      freeLeagueColors: [],
      id: null,
      formData: {
        hostColor: "",
        guestColor: "",
        provinceId: "",
        winPoint: "",
        losePoint: "",
      },
    };
  },
  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = { ...i };
      this.formData.password = "";
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        hostColor: "",
        guestColor: "",
        provinceId: "",
        winPoint: "",
        losePoint: "",
      };
      this.id = null;
    },
    update: function (id) {
      this.$axios
        .put(`/freeLeagues/${id}`, this.formData)
        .then(() => {
          this.getFreeLeagues().then(({ data }) => {
            this.freeLeagueColors = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/freeLeagues", this.formData)
        .then(() => {
          this.getFreeLeagues().then(({ data }) => {
            this.freeLeagueColors = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/freeLeagues/${id}`)
          .then(() => {
            this.getFreeLeagues().then(({ data }) => {
              this.freeLeagueColors = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },
    getFreeLeagues: function () {
      return this.$axios
        .get("/freeLeagues?associations=province")
        .then((res) => {
          return res;
        });
    },
  },
  mounted() {
    this.getProvinces().then(({ data }) => {
      this.provinces = [
        {
          id: "",
          name: "İl Seçilmedi",
        },
        ...data.sort((a, b) => parseInt(a.plateCode) - parseInt(b.plateCode)),
      ];
    });
    this.getFreeLeagues().then(({ data }) => {
      this.freeLeagueColors = data;
    });
  },
};
</script>
