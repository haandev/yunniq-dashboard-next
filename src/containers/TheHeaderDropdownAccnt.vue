<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img src="img/avatars/logo.png" class="c-avatar-img" />
        </div>
      </CHeaderNavLink>
    </template>

    <CDropdownItem @click="logout()">
      <CIcon name="cil-lock-locked" /> Çıkış Yap
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: "TheHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push('/pages/login');
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>