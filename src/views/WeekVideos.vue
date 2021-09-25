<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Haftanın Hareketleri</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <label v-if="videos && videos.length > 0"
                  >{{ videos.length }} video seçildi</label
                >
                <CInputFile
                  name="files"
                  label="Videolar"
                  placeholder="Videolar"
                  custom
                  multiple
                  accept="video/mp4,video/x-m4v,video/*"
                  @change="selectVideos($event)"
                />
              </CCol>
              <CCol sm="12">
                <CSelect
                  :value.sync="formData.provinceId"
                  label="İl"
                  :disabled="this.user.role !== 'SuperAdmin'"
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
              <CIcon name="cil-grid" /> Haftanın Hareketleri
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="weekVideos"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'province',
                  label: 'İl Adı',
                },
                {
                  key: 'status',
                  label: 'Durum',
                },
                {
                  key: 'url',
                  label: 'Video Linki',
                },
                {
                  key: 'createdDate',
                  label: 'Yüklenme Tarihi',
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
                <td>
                  {{ item.provinceId ? item.province.name : "Anasayfa" }}
                </td>
              </template>
              <template #createdDate="{ item }">
                <td>
                  {{ $moment(item.createdDate).format("DD.MM.YYYY HH:mm") }}
                </td>
              </template>
              <template #status="{ item }">
                <td>
                  {{ item.status === 0 ? "Pasif" : "Aktif" }}
                </td>
              </template>
              <template #url="{ item }">
                <td>
                  <a
                    :href="`${$axios.defaults.baseURL}/uploads/${item.url}`"
                    target="_blank"
                  >
                    Link
                  </a>
                </td>
              </template>
              <template #actions="{ item }">
                <td>
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
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "WeekVideos",
  components: {},
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      mode: "new",
      provinces: [],
      weekVideos: [],
      id: null,
      videos: [],
      formData: {
        provinceId: "",
      },
    };
  },
  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = { ...i };
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.videos = [];
      this.formData = {
        provinceId: "",
      };
      this.id = null;
    },
    create: async function () {
      const data = (await this.uploadVideos()).map((url) => ({
        url,
        provinceId: this.formData.provinceId ? this.formData.provinceId : null,
        createdDate: moment().format("YYYY-MM-DD HH:mm"),
      }));

      this.$axios
        .post("/weekVideos", data)
        .then(() => {
          this.getWeekVideos().then(({ data }) => {
            this.weekVideos = data;

            if (this.user.role !== "SuperAdmin") {
              this.formData.provinceId = this.user.provinceId;
            }
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
          .delete(`/weekVideos/${id}`)
          .then(() => {
            this.getWeekVideos().then(({ data }) => {
              this.weekVideos = data;

              if (this.user.role !== "SuperAdmin") {
                this.formData.provinceId = this.user.provinceId;
              }
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
    getWeekVideos: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `&provinceId=${this.user.provinceId}`;
      return this.$axios
        .get(
          `/weekVideos?associations=province&sort=status:desc${provinceFilter}`
        )
        .then((res) => {
          return res;
        });
    },
    selectVideos(event) {
      this.videos = event;
    },
    async uploadVideos() {
      const videoNames = [];

      for (let video of this.videos) {
        const formData = new FormData();
        formData.append("file", video);
        const { data } = await this.$axios.post("/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        videoNames.push(data.fileName);
      }

      return videoNames;
    },
  },
  mounted() {
    this.getProvinces().then(({ data }) => {
      this.provinces = [
        { id: "", name: "İl Seçilmedi" },
        ...data.sort((a, b) => parseInt(a.plateCode) - parseInt(b.plateCode)),
      ];
    });
    this.getWeekVideos().then(({ data }) => {
      this.weekVideos = data;

      if (this.user.role !== "SuperAdmin") {
        this.formData.provinceId = this.user.provinceId;
      }
    });
  },
};
</script>
