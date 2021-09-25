<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Maç</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CSelect
                  :value.sync="formData.leagueId"
                  label="Lig"
                  :options="leagues"
                  @change="leagueChanged()"
                />
              </CCol>

              <CCol sm="12">
                <CSelect
                  :value.sync="formData.team_1_id"
                  label="Ev Sahibi Takım"
                  :options="leagueTeams"
                />
              </CCol>

              <CCol sm="12">
                <CSelect
                  :value.sync="formData.team_2_id"
                  label="Konuk Takım"
                  :options="leagueTeams"
                />
              </CCol>

              <CCol sm="12">
                <CInput
                  :value.sync="formData.date"
                  label="Tarih"
                  type="datetime-local"
                  placeholder="Tarih"
                />
              </CCol>

              <CCol sm="12">
                <CSelect
                  :value.sync="formData.refereeId"
                  label="Hakem"
                  :options="referees"
                />
              </CCol>

              <CCol sm="12">
                <CSelect
                  :value.sync="formData.observerId"
                  label="Gözlemci"
                  :options="observers"
                />
              </CCol>

              <CCol sm="12">
                <CSelect
                  :value.sync="formData.placeId"
                  label="Tesis"
                  :options="places"
                />
              </CCol>

              <CCol sm="12">
                <CInput
                  :value.sync="formData.score_1"
                  label="Skor 1"
                  placeholder="Skor 1"
                />
              </CCol>

              <CCol sm="12">
                <CInput
                  :value.sync="formData.score_2"
                  label="Skor 2"
                  placeholder="Skor 2"
                />
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right mb-2">
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
                <CButton
                  v-if="mode !== 'new'"
                  @click="createAction()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Maç İçi Hareketleri</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol v-if="showActions" col="12">
        <CRow>
          <CCol col="12">
            <Actions
              :users="users"
              :teams="[formData.team_1, formData.team_2]"
              :seasonId="formData.league.seasonId"
              :matchId="id"
            />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <slot name="header">
              <CIcon name="cil-grid" /> Canlı Yayın Linleri
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :hover="true"
              :striped="true"
              :items="links"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'url',
                  label: 'Link',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="editLink(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeLink(item.id)"
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
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>Canlı Yayın Linki</strong>
            <div class="card-header-actions">
              <small v-text="linkMode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput
                  :value.sync="linkFormData.url"
                  label="Canlı Yayın Linki"
                  placeholder="Canlı Yayın Linki"
                />
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right mb-2">
                <CButton
                  v-if="linkMode !== 'new'"
                  @click="updateLink(linkId)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createLink()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanLink()"
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
      <match-images :matchId="id" />
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <slot name="header"> <CIcon name="cil-grid" /> Maçlar </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="matches"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'team1',
                  label: '1.Takım',
                },
                {
                  key: 'score_1',
                  label: '1.Takım Skor',
                },
                {
                  key: 'team2',
                  label: '2.Takım',
                },
                {
                  key: 'score_2',
                  label: '2.Takım Skor',
                },
                {
                  key: 'league',
                  label: 'Lig',
                },
                {
                  key: 'place',
                  label: 'Tesis',
                },
                {
                  key: 'status',
                  label: 'Durum',
                },
                {
                  key: 'date',
                  label: 'Tarih',
                },
                {
                  key: 'observer',
                  label: 'Gözlemci',
                },
                {
                  key: 'referee',
                  label: 'Hakem',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #team1="{ item }">
                <td class="img-col">
                  <img
                    class="list-image"
                    :src="
                      item.team_1.logo
                        ? `${$axios.defaults.baseURL}/uploads/${item.team_1.logo}`
                        : 'img/avatars/logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  />
                  {{ item.team_1.name }}
                </td>
              </template>
              <template #team2="{ item }">
                <td class="img-col">
                  <img
                    class="list-image"
                    :src="
                      item.team_2.logo
                        ? `${$axios.defaults.baseURL}/uploads/${item.team_2.logo}`
                        : 'img/avatars/logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  />
                  {{ item.team_2.name }}
                </td>
              </template>
              <template #league="{ item }">
                <td>
                  {{ item.league ? item.league.name : "" }}
                </td>
              </template>
              <template #status="{ item }">
                <td>
                  {{
                    item.status === 0
                      ? "Rezervasyon"
                      : item.status === 1
                      ? "Oynanacak"
                      : item.status === 2
                      ? "Oynanıyor"
                      : item.status === 3
                      ? "Oynandı"
                      : item.status === 4
                      ? "İptal Edildi"
                      : ""
                  }}
                </td>
              </template>
              <template #place="{ item }">
                <td>
                  {{ item.place ? item.place.name : "" }}
                </td>
              </template>
              <template #date="{ item }">
                <td>
                  {{ item.date | moment("DD.MM.YYYY HH:mm") }}
                </td>
              </template>
              <template #score_1="{ item }">
                <td>
                  {{ item.score_1 ? item.score_1 : "" }}
                </td>
              </template>
              <template #score_2="{ item }">
                <td>
                  {{ item.score_2 ? item.score_2 : "" }}
                </td>
              </template>
              <template #observer="{ item }">
                <td>
                  {{ item.observer ? item.observer.name : "" }}
                  {{ item.observer ? item.observer.surname : "" }}
                </td>
              </template>
              <template #referee="{ item }">
                <td>
                  {{ item.referee ? item.referee.name : "" }}
                  {{ item.referee ? item.referee.surname : "" }}
                </td>
              </template>
              <template #actions="{ item }">
                <td>
                  <CButton
                    v-if="item.status === 0"
                    @click="clearGuest(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Rakibi Temizle</CButton
                  >
                  <CButton
                    v-if="item.status === 0"
                    @click="accept(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Onayla</CButton
                  >

                  <CButton
                    @click="edit(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
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
import Actions from "../components/Actions.vue";
import MatchImages from "../components/MatchImages.vue";
import moment from "moment";

export default {
  name: "Match",
  components: { Actions, MatchImages },
  data() {
    return {
      mode: "new",
      linkMode: "new",
      showActions: false,
      matches: [],
      leagues: [],
      leagueTeams: [{ value: "", label: "Lig Seçilmedi" }],
      referees: [],
      observers: [],
      places: [],
      users: [],
      id: null,
      linkId: null,
      links: [],
      linkFormData: {
        url: "",
        matchId: "",
      },
      formData: {
        leagueId: "",
        team_1_id: "",
        team_2_id: "",
        date: "",
        refereeId: "",
        observerId: "",
        placeId: "",
        score_1: "",
        score_2: "",
      },
    };
  },
  methods: {
    async edit(i) {
      this.mode = "edit";
      this.formData = { ...i };
      this.id = i.id;
      delete this.formData.id;
      this.showActions = false;
      this.linkFormData.matchId = this.id;

      const { data: users } = await this.getUsers();
      this.users = users;

      this.getLinks();
    },
    async editLink(i) {
      this.linkMode = "edit";
      this.linkFormData = { ...i };
      this.linkId = i.id;
      delete this.linkFormData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        name: "",
        plateCode: "",
      };
      this.id = null;
    },
    async clearGuest(match) {
      const { data } = await this.$axios.get(`/online?date=${match.date}`);

      const reservation = data[0];
      await this.$axios.post("/online/rejectFromHost", {
        reservationId: reservation.id,
      });

      await this.$axios.delete(`/matches/${match.id}`);

      this.getMatches().then(({ data }) => {
        this.matches = data;
      });
    },
    async accept(match) {
      const { data } = await this.$axios.get(`/online?date=${match.date}`);

      const reservation = data[0];
      await this.$axios.post("/online/acceptFromHost", {
        reservationId: reservation.id,
      });

      await this.$axios.put(`/matches/${match.id}`, { status: 1 });

      this.getMatches().then(({ data }) => {
        this.matches = data;
      });
    },
    cleanLink() {
      this.linkMode = "new";
      this.linkFormData = {
        matchId: this.id,
        url: "",
      };
      this.linkId = null;
    },
    update: function (id) {
      this.$axios
        .put(`/matches/${id}`, this.formData)
        .then(() => {
          this.getMatches().then(({ data }) => {
            this.matches = data;
          });
          this.clean();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    create: function () {
      this.$axios
        .post("/matches", this.formData)
        .then(async ({ data: match }) => {
          if (moment(new Date()).isAfter(this.formData.date)) {
            await this.$axios.post(`/matches/setPlayers/${match.id}`);
            await this.$axios.post(`/matches/finishMatch/${match.id}`);
          }

          this.getMatches().then(({ data }) => {
            this.matches = data;
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
          .delete(`/matches/${id}`)
          .then(() => {
            this.getMatches().then(({ data }) => {
              this.matches = data;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updateLink: function (id) {
      this.$axios
        .put(`/liveStreams/${id}`, this.linkFormData)
        .then(() => {
          this.getLinks();
          this.cleanLink();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createLink: function () {
      this.$axios
        .post("/liveStreams", this.linkFormData)
        .then(() => {
          this.getLinks();
          this.cleanLink();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeLink: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/liveStreams/${id}`)
          .then(() => {
            this.getLinks();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getMatches: function () {
      return this.$axios
        .get(
          "/matches?associations=team_1,team_2,referee,observer,place,fixture,league"
        )
        .then((res) => {
          return res;
        });
    },
    getLeagues: function () {
      return this.$axios.get("/leagues").then((res) => {
        return res;
      });
    },
    getLeagueTeams: function () {
      const leagueFilter =
        this.formData.leagueId && `&leagueId=${this.formData.leagueId}`;
      return this.$axios
        .get(`/leagueTeams?associations=team${leagueFilter}`)
        .then((res) => {
          return res;
        });
    },
    getLeagues: function () {
      return this.$axios.get("/leagues").then((res) => {
        return res;
      });
    },
    getReferees: function () {
      return this.$axios.get("/systemTeamUsers?role=Hakem").then((res) => {
        return res;
      });
    },
    getObservers: function () {
      return this.$axios.get("/systemTeamUsers?role=Gözlemci").then((res) => {
        return res;
      });
    },
    getPlaces: function () {
      return this.$axios.get("/places").then((res) => {
        return res;
      });
    },
    getUsers: function () {
      return this.$axios
        .get(`/teamMatchUsers?associations=user&matchId=${this.id}`)
        .then((res) => {
          return res;
        });
    },
    getLinks: function () {
      this.$axios.get(`/liveStreams?matchId=${this.id}`).then(({ data }) => {
        this.links = data;
      });
    },
    leagueChanged() {
      this.getLeagueTeams().then(({ data }) => {
        console.log(data);
        this.leagueTeams = [
          { value: "", label: "Takım Seçilmedi" },
          ...data.map((x) => ({ value: x.team.id, label: x.team.name })),
        ];
      });
    },
    createAction() {
      this.showActions = true;
    },
  },
  mounted() {
    this.getMatches().then(({ data }) => {
      this.matches = data;
    });
    this.getLeagues().then(({ data }) => {
      this.leagues = [
        { value: "", label: "Lig Seçilmedi" },
        ...data.map((x) => ({ value: x.id, label: x.name })),
      ];
    });
    this.leagueChanged();
    this.getReferees().then(({ data }) => {
      this.referees = [
        { value: "", label: "Hakem Seçilmedi" },
        ...data.map((x) => ({ value: x.id, label: `${x.name} ${x.surname}` })),
      ];
    });
    this.getObservers().then(({ data }) => {
      this.observers = [
        { value: "", label: "Gözlemci Seçilmedi" },
        ...data.map((x) => ({ value: x.id, label: `${x.name} ${x.surname}` })),
      ];
    });
    this.getPlaces().then(({ data }) => {
      this.places = [
        { value: "", label: "Tesis Seçilmedi" },
        ...data.map((x) => ({ value: x.id, label: x.name })),
      ];
    });
  },
};
</script>
<style scoped>
.img-col {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.list-image {
  width: 35px;
  height: 100%;
  border-radius: 50%;
}
</style>