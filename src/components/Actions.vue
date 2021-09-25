<template>
  <CRow>
    <CCol sm="9">
      <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> Hareketler </slot>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            :hover="true"
            :striped="true"
            :items="actions"
            :fields="[
              {
                key: 'id',
                label: 'ID',
              },
              {
                key: 'type',
                label: 'Hareket Tipi',
              },
              {
                key: 'team',
                label: 'Takım',
              },
              {
                key: 'player',
                label: 'Oyuncu',
              },
              {
                key: 'time',
                label: 'Dakika',
              },
              {
                key: 'actions',
                label: 'Aksiyonlar',
              },
            ]"
            :items-per-page="10"
            pagination
          >
            <template #type="{ item }">
              <td>
                {{ item.type ? item.type.name : "" }}
              </td>
            </template>
            <template #time="{ item }">
              <td>
                {{ formatTime(item.time) }}
              </td>
            </template>
            <template #team="{ item }">
              <td>
                <span class="img-col">
                  <img
                    class="list-image"
                    :src="
                      item.team.logo
                        ? `${$axios.defaults.baseURL}/uploads/${item.team.logo}`
                        : 'img/avatars/logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  />
                  {{ item.team.name }}
                </span>
              </td>
            </template>

            <template #player="{ item }">
              <td>
                <span class="img-col">
                  <img
                    class="list-image"
                    :src="
                      item.player.image
                        ? `${$axios.defaults.baseURL}/uploads/${item.player.image}`
                        : 'img/avatars/logo.png'
                    "
                    alt="Image not found"
                    onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  />
                  {{ item.player.firstname }} {{ item.player.lastname }}
                </span>
              </td>
            </template>

            <template #actions="{ item }">
              <td>
                <CButton
                  @click="edit(item, item.isMove)"
                  size="sm"
                  variant="outline"
                  color="primary"
                  class="mr-1"
                  >Düzenle</CButton
                >
                <CButton
                  @click="remove(item.id, item.isMove)"
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
    <CCol sm="3">
      <CCard>
        <CCardHeader>
          <strong>Hareket</strong>
          <div class="card-header-actions">
            <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12">
              <CSelect
                :value.sync="formData.actionTypeId"
                label="Hareket Tipi"
                :options="[
                  { value: '', label: 'Hareket Tipi Seçilmedi' },
                  ...actionTypes.map((p) => ({
                    value: p.id,
                    label: p.name,
                  })),
                ]"
              />
            </CCol>

            <CCol sm="12">
              <CSelect
                :value.sync="formData.teamId"
                label="Takım"
                :options="[
                  { value: '', label: 'Takım Seçilmedi' },
                  ...teams.map((team) => ({
                    value: team.id,
                    label: team.name,
                  })),
                ]"
                @change="teamChanged()"
              />
            </CCol>

            <CCol sm="12">
              <CSelect
                :value.sync="formData.userId"
                label="Oyuncu"
                :options="teamUsers"
              />
            </CCol>

            <CCol sm="12">
              <CInput
                :value.sync="formData.minutes"
                label="Dakika"
                placeholder="Dakika"
              />
            </CCol>

            <CCol sm="12">
              <CInput
                :value.sync="formData.seconds"
                label="Saniye"
                placeholder="Saniye"
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
                @click="createAction()"
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
</template>
<script>
export default {
  name: "Actions",
  props: ["teams", "users", "matchId", "seasonId"],
  data() {
    return {
      mode: "new",
      matches: [],
      moves: [],
      faults: [],
      actions: [],
      moveTypes: [],
      faultTypes: [],
      actionTypes: [],
      teamUsers: [],
      id: null,
      formData: {
        actionTypeId: "",
        teamId: "",
        time: "",
        userId: "",
        seconds: "0",
        minutes: "0",
      },
    };
  },
  methods: {
    async edit(i) {
      this.mode = "edit";
      this.formData = { ...i, userId: "" };

      this.id = i.id;
      delete this.formData.id;

      const second = i.time || 0;

      const minutes = Math.floor(second / 60);
      const seconds = second - parseInt(minutes * 60);

      this.formData.minutes = minutes;
      this.formData.seconds = seconds;

      this.teamChanged();

      const actionTypeId = i.isMove ? `M_${i.type.id}` : `F_${i.type.id}`;

      this.formData = {
        ...this.formData,
        userId: i.userId,
        actionTypeId,
      };
    },
    clean() {
      this.mode = "new";
      this.formData = {
        actionTypeId: "",
        teamId: "",
        time: "",
        userId: "",
        seconds: "0",
        minutes: "0",
      };
      this.id = null;
    },
    update: async function (id) {
      const isMove = this.formData.actionTypeId.split("_")[0] === "M";
      const typeId = this.formData.actionTypeId.split("_")[1];
      const time =
        parseInt(parseInt(this.formData.minutes) * 60) +
        parseInt(this.formData.seconds);

      if (isMove) {
        await this.$axios.put(`/moves/${id}`, {
          moveTypeId: typeId,
          matchId: this.matchId,
          teamId: this.formData.teamId,
          userId: this.formData.userId,
          time,
          status: 1,
        });
      } else {
        await this.$axios.put(`/faults/${id}`, {
          userId: this.formData.userId,
          teamId: this.formData.teamId,
          seasonId: this.seasonId,
          matchId: this.matchId,
          name: null,
          description: null,
          faultTypeId: typeId,
          time,
        });
      }

      await this.$axios.post(`/matches/setScore/${this.matchId}`);
      await this.$axios.post(`/matches/calculatePoint/${this.matchId}`);
      await this.fetchActions();
      this.clean();
    },
    remove: function (id, isMove) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        const endPoint = isMove ? "/moves" : "/faults";
        this.$axios
          .delete(`${endPoint}/${id}`)
          .then(() => {
            this.fetchActions();
            this.clean();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    createAction: async function () {
      const isMove = this.formData.actionTypeId.split("_")[0] === "M";
      const typeId = this.formData.actionTypeId.split("_")[1];
      const time =
        parseInt(parseInt(this.formData.minutes) * 60) +
        parseInt(this.formData.seconds);
      if (isMove) {
        await this.$axios.post(`/moves`, {
          moveTypeId: typeId,
          matchId: this.matchId,
          teamId: this.formData.teamId,
          userId: this.formData.userId,
          time,
          status: 1,
        });
      } else {
        await this.$axios.post(`/faults`, {
          userId: this.formData.userId,
          teamId: this.formData.teamId,
          seasonId: this.seasonId,
          matchId: this.matchId,
          name: null,
          description: null,
          faultTypeId: typeId,
          time,
        });
      }

      await this.$axios.post(`/matches/setScore/${this.matchId}`);
      await this.$axios.post(`/matches/calculatePoint/${this.matchId}`);
      await this.fetchActions();
      this.clean();
    },
    getMoves: function () {
      return this.$axios
        .get(
          `/moves?associations=moveType,user,loserUser,team&matchId=${this.matchId}`
        )
        .then((res) => {
          return res;
        });
    },
    getFaults: function () {
      return this.$axios
        .get(`/faults?associations=faultType,user,team&matchId=${this.matchId}`)
        .then((res) => {
          return res;
        });
    },
    getMoveTypes: function () {
      return this.$axios.get(`/moveTypes`).then((res) => {
        return res;
      });
    },
    getFaultTypes: function () {
      return this.$axios.get(`/faultTypes`).then((res) => {
        return res;
      });
    },
    teamChanged() {
      console.log("teamUsers", this.teamUsers);
      this.teamUsers = [
        { value: "", label: "Oyuncu Seçilmedi" },
        ...this.users
          .filter((x) => x.teamId === this.formData.teamId)
          .map((u) => ({
            value: u.user.id,
            label: `${u.user.firstname} ${u.user.lastname}`,
          })),
      ];
    },
    mapActions() {
      console.log(this.moves);
      return [
        ...this.moves.map((move) => {
          console.log(move);
          return {
            id: move.id,
            type: {
              id: move.moveType.id,
              name: move.moveType.name,
            },
            userId: move.userId,
            teamId: move.teamId,
            team: {
              name: move.team.name,
              logo: move.team.logo,
            },
            player: {
              firstname: move.user.firstname,
              lastname: move.user.lastname,
              image: move.user.image,
            },
            time: move.time,
            isMove: true,
            isFault: false,
          };
        }),
        ...this.faults.map((fault) => ({
          id: fault.id,
          type: {
            id: fault.faultType.id,
            name: fault.faultType.name,
          },
          userId: fault.userId,
          teamId: fault.teamId,
          team: {
            name: fault.team.name,
            logo: fault.team.logo,
          },
          player: {
            firstname: fault.user.firstname,
            lastname: fault.user.lastname,
            image: fault.user.image,
          },
          time: fault.time,
          isMove: false,
          isFault: true,
        })),
      ].sort((a, b) => a.time - b.time);
    },
    mapTypes() {
      return [
        ...this.moveTypes.map((type) => ({
          id: `M_${type.id}`,
          name: type.name,
          isMove: true,
          isFault: false,
        })),
        ...this.faultTypes.map((type) => ({
          id: `F_${type.id}`,
          name: type.name,
          isMove: false,
          isFault: true,
        })),
      ];
    },
    async fetchTypes() {
      try {
        const { data: faultTypes } = await this.getFaultTypes();
        this.faultTypes = faultTypes;

        const { data: moves } = await this.getMoveTypes();
        this.moveTypes = moves;

        this.actionTypes = this.mapTypes();
      } catch (error) {
        console.log(error);
      }
    },
    async fetchActions() {
      const { data: moves } = await this.getMoves();
      this.moves = moves;

      const { data: faults } = await this.getFaults();
      this.faults = faults;

      this.actions = this.mapActions();
    },
    formatTime(time) {
      const second = time || 0;

      const minutes = Math.floor(second / 60);
      const seconds = second - parseInt(minutes * 60);

      return `${minutes} dk. ${seconds} sn.`;
    },
  },
  mounted() {
    this.fetchTypes();
    this.fetchActions();
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