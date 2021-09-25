<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Takım</strong>
            <div class="card-header-actions">
                <small v-text="mode==='new'? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <img class="crop-image pick-logo-team" :src="uploaded" alt="Image not found" />

              </CCol>
              <CCol sm="8">
                <CRow>
                  <CCol sm="6">
                    <CInput
                        :value.sync="formData.name"
                        label="Takım Adı"
                        placeholder="Takım Adı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.captainId"
                        label="Kaptan"
                        :options="teamPlayers.map(p => ({
          value: p.id,
          label: `${p.firstname} ${p.lastname}`
        }))"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.provinceId"
                        label="İl"
                        :options="provinces.map(p => ({
          value: p.id,
          label: p.name
        }))"
                    />
                  </CCol>
                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.districtId"
                        label="İlçe"
                        :options="districts.filter(d=>(d.provinceId===formData.provinceId)).map(p => ({
          value: p.id,
          label: p.name
        }))"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="6">
                  <CInput
                      :value.sync="formData.foundationDate"
                      label="Kuruluş Tarihi"
                      type="date"
                      placeholder="Kuruluş Tarihi"
                  />
                  </CCol>
                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.status"

                        label="Durumu"
                        :options="[{
          value: 0,
          label: 'Pasif'
        },{
          value: 1,
          label: 'Aktif'
        }]"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr>
            <CRow>
              <CCol sm="12"  class="text-right">
                <CButton v-if="mode!=='new'" @click="update(id)" size="sm" color="primary" class="mr-1">Kaydet</CButton>
                <CButton v-else @click="create()" size="sm" color="primary" class="mr-1">Yeni Ekle</CButton>
                <CButton  @click="clean()" size="sm" variant="outline" color="primary" class="mr-1">Temizle</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="6" v-if="!!id">

        <CCard>
          <CCardHeader>
            <strong>Oyuncu</strong>
            <div class="card-header-actions">
              <small v-text="modePlayer==='new'? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="8">
                <CRow>

                </CRow>
                <CRow>
                  <CCol sm="6">
                    <CSelect v-model="selected"
                        label="Oyuncu"
                        :options="ProvincePlayers.filter(t=>(t.provinceId===formData.provinceId)).map(p => ({
          value: p.id,
          label: p.firstname+ ' ' + p.lastname
        }))"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr>
            <CRow>
              <CCol sm="12"  class="text-right">
                <CButton v-if="modePlayer!=='new'" @click="updatePlayer(playerFormData.id)" size="sm" color="primary" class="mr-1">Kaydet</CButton>
                <CButton v-else @click="createPlayer()" size="sm" color="primary" class="mr-1">Ekle</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard >
          <CCardHeader>
            <strong>Oyuncular</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                :hover="true"
                :striped="true"
                :items="teamPlayers"
                :fields="[
                  {
                    key:'id',
                    label:'ID'
                  },
                  {
                    key:'imageImg',
                    label:'Img'
                  },
                  {
                    key:'firstname',
                    label:'Ad'
                  },
                  {
                    key:'lastname',
                    label:'Soyad'
                  },
                  {
                    key:'position1Str',
                    label:'Pozisyon 1'
                  },
                  {
                    key:'position2Str',
                    label:'Pozisyon 2'
                  },
                  {
                    key:'actions',
                    label:'Aksiyonlar'
                  }
                  ]"
                :items-per-page="10"
                pagination
            >
              <template #imageImg="{item}"><td>
                <img class="list-image"
                     :src="item.image ? `${$axios.defaults.baseURL}/uploads/${item.image}` : 'img/avatars/logo.png'"
                     alt="Image not found" onerror="this.onerror=null;this.src='img/avatars/logo.png';" />
              </td></template>
<template #position1Str="{item}">
  <td>
    {{ positions.find(p=>(p.id === item.position1Id ))&& positions.find(p=>(p.id === item.position1Id )).name}}
  </td>
</template>
<template #position2Str="{item}">
  <td>
    {{ positions.find(p=>(p.id === item.position2Id )) && positions.find(p=>(p.id === item.position2Id )).name}}
  </td>
</template>
              <template #actions="{item}">
                <td>
                  <CButton  @click="removePlayer(item.id)" size="sm" variant="outline" color="danger">Sil</CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>

        <avatar-cropper
            @uploaded="handleUploadedPlayer"
            trigger=".pick-logo-player"
            :labels="{cancel:'Vazgeç',submit:'Onayla'}"
            :uploadUrl="`${$axios.defaults.baseURL}/file`"
        />
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
      <CCard>
        <CCardHeader>
          <slot name="header">
            <CIcon name="cil-grid"/> Takım Listesi
          </slot>
        </CCardHeader>
        <CCardBody>
          <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="teams"
              :fields="[
                  {
                    key:'id',
                    label:'ID'
                  },
                  {
                    key:'logoImg',
                    label:'Logo'
                  },
                  {
                    key:'name',
                    label:'Takım Adı'
                  },
                  {
                    key:'captain',
                    label:'Kaptanı'
                  },
                  {
                    key:'foundationDateStr',
                    label:'Kuruluş Tarihi'
                  },
                  {
                    key:'province',
                    label:'İl'
                  },
                  {
                    key:'district',
                    label:'İlçe'
                  },
                  {
                    key:'statusStr',
                    label:'Durumu'
                  },
                  {
                    key:'totalPrice',
                    label:'Değeri'
                  },
                  {
                    key:'actions',
                    label:'Aksiyonlar'
                  },]"
              :items-per-page="10"
              pagination
          >

            <template #statusStr="{item}"><td>
              {{ item.status === 0 ? 'Pasif' : 'Aktif'}}
              </td></template>
            <template #logoImg="{item}"><td>
              <img class="list-image"
              :src="item.logo ? `${$axios.defaults.baseURL}/uploads/${item.logo}` : 'img/avatars/logo.png'"
                    alt="Image not found" onerror="this.onerror=null;this.src='img/avatars/logo.png';" />
              </td></template>
            <template #foundationDateStr="{item}"><td>
                {{ item.foundationDate | moment("DD/MM/YYYY") }}
              </td></template>
            <template #province="{item}"><td>{{
              provinces.find(p=>p.id===item.provinceId).name
              }}</td></template>
            <template #district="{item}"><td>{{
                districts.find(p=>p.id===item.districtId) &&  districts.find(p=>p.id===item.districtId).name
              }}</td></template>
            <template #actions="{item}">
              <td>
                <CButton  @click="edit(item)" size="sm" variant="outline" color="primary" class="mr-1">Düzenle</CButton>
                <CButton  @click="remove(item.id)" size="sm" variant="outline" color="danger">Sil</CButton>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
      </CCol>

    </CRow>



    <avatar-cropper
        @uploaded="handleUploaded"
        trigger=".pick-logo-team"
        :labels="{cancel:'Vazgeç',submit:'Onayla'}"
        :uploadUrl="`${$axios.defaults.baseURL}/file`"
    />


  </div>
</template>
<style>
.list-image{
  width: 35px;
}
.crop-image{
  max-width: 100%;
}
</style>
<script>
import AvatarCropper from "vue-avatar-cropper";
import { mapState } from "vuex";

export default {
  name: 'Teams',
  components: { AvatarCropper },
  data(){
    return {
      mode: 'new',
      modePlayer: 'new',
      provinces : [],
      positions : [],
      districts : [],
      teams : [],
      id : null,
      uploaded : 'https://via.placeholder.com/250',
      uploadedPlayer : 'https://via.placeholder.com/250',
      teamPlayers: [{
        value : "0",
        firstname : "Henüz",
        lastname : "Oyuncu Yok"
      }],
      ProvincePlayers: [],
      formData : {},
      UserData : {},
      playerFormData : {}
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    edit(i){
      this.mode = 'edit'
      this.formData = {...i}
      this.formData.password = ""
      this.id = i.id
      delete this.formData.id
      this.getUsersByTeam(this.id).then((res)=>{
        this.teamPlayers = res.data
      })
      this.getUsersByProvince(i.provinceId).then((res)=>{
        this.ProvincePlayers = res.data
      })
       this.formData.foundationDate = this.formData.foundationDate?.split('T')?.[0]
       this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${i.logo}`
      this.playerFormData={
        provinceId : i.provinceId,
        teamId : i.id
      }
      console.log(this.playerFormData)
    },
    editPlayer(i){
      this.modePlayer = 'edit';
      this.playerFormData = i;
      this.playerFormData.birthday = i.birthday?.split('T')?.[0]

    },
    cleanPlayer(){
      this.modePlayer = 'new'
      this.playerFormData={
        provinceId : this.formData.provinceId,
        teamId : this.id
      }
      this.uploadedPlayer = 'https://via.placeholder.com/250';
    },
    updatePlayer:  function(id){
      this.playerFormData.password === "" && delete this.playerFormData.password
      this.$axios.put(`/users/${id}`,this.playerFormData).then(() => {
        this.getUsersByTeam(this.id).then(({data}) => {
          this.teamPlayers = data
        })
        this.cleanPlayer()
      }).catch(err=>{
        console.log(err)
      })
    },
    createPlayer: function(){
      this.$axios.put('/users/'+(this.selected.srcElement.selectedOptions[0].value),{teamId:this.id}).then(() => {
        this.getUsersByTeam(this.id).then(({data}) => {
          this.teamPlayers = data
        })
        this.cleanPlayer()
      }).catch(err=>{
        console.log(err)
      })
    },
    removePlayer: function(id){
      this.$axios.put('/users/'+id,{teamId:-1}).then(() => {
        this.getUsersByTeam(this.id).then(({data}) => {
          this.teamPlayers = data
        })
      }).catch(err=>{
        console.log(err)
      })
    },
    clean: function(){
      this.mode = 'new'
      this.formData = {
        username :"",
        password : "",
        provinceId : "",
        role : "Moderator"
      }
      this.teamPlayers= [{
        value : "0",
        firstname : "Henüz",
        lastname : "Oyuncu Yok"
      }],

      this.uploaded = 'https://via.placeholder.com/250';
      this.uploadedPlayer = 'https://via.placeholder.com/250';
      this.id = null;
    },
    update:  function(id){
      this.formData.password === "" && delete this.formData.password
      this.$axios.put(`/teams/${id}`,this.formData).then(() => {
        this.getTeams().then(({data}) => {
          this.teams = data
        })
        this.clean()
      }).catch(err=>{
        console.log(err)
      })
    },
    create:  function(){

      this.$axios.post('/teams',this.formData).then(() => {
        this.getTeams().then(({data}) => {
          this.teams = data
        })
        this.clean()
      }).catch(err=>{
        console.log(err)
      })
    },
    remove:  function(id){
      if (confirm("Silmek istediğinize emin misiniz")){
        this.$axios.delete(`/teams/${id}`).then(() => {
          this.getTeams().then(({data}) => {
            this.teams = data
          })
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    getUserById : async function(id){
      const user = await this.$axios.get(`/users/${id}`)
      return user
    },
    /* getTeams:  function(){
      return this.$axios.get('/teams').then(res => {
        return res
      });
    }, */
    getTeams:  function(){
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/teams?${provinceFilter}`).then(res => {
        return res
      });
    },

    getUsersByTeam:  function(id){
      return this.$axios.get(`/users?teamId=${id}`).then(res => {
        return res
      });
    },
    getUsersByProvince:  function(id){
      return this.$axios.get(`/users?provinceId=${id}`).then(res => {
        return res
      });
    },
    getUsersByID:  function(id){
      return this.$axios.get(`/users?id=${id}`).then(res => {
        return res
      });
    },
    getPositions:  function(){
      return this.$axios.get('/positions').then(res => {
        return res
      })
    },
    getProvinces:  function(){
      return this.$axios.get('/provinces').then(res => {
        return res
      })
    },
    getDistricts:  function(){
      return this.$axios.get('/districts').then(res => {
        return res
      })
    },
    handleUploaded(e){
      this.formData.logo=e.fileName
      this.uploaded=`${this.$axios.defaults.baseURL}/uploads/${e.fileName}`
    },
    handleUploadedPlayer(e){
      this.formData.logo=e.fileName
      this.uploadedPlayer=`${this.$axios.defaults.baseURL}/uploads/${e.fileName}`
    }
  },
  mounted() {
    this.getProvinces().then(({data})=>{
      this.provinces=[{
        id: '0',
        name: 'İl Seçilmedi'
      },...data]
    })
    this.getPositions().then(({data})=>{
      this.positions=data
    })
    this.getDistricts().then(({data})=>{
      this.districts=[{
        id: '0',
        name: 'İlçe Seçilmedi'
      },...data]
    })
    this.getTeams().then(({data}) => {
      const reqs = data.map(async (team)=>{
        const captain = await this.getUserById(team.captainId)
        if (team.captainId) {
          team.captain = `${captain.data.firstname} ${captain.data.lastname}`
        }
        else {
          team.captain = "Kaptan Bulunamadı"
        }
        console.log(captain)
        return captain
      })
      Promise.allSettled(reqs).then(()=>{
        console.log("done")
        this.teams=data
      })

    })

  }
}
</script>
