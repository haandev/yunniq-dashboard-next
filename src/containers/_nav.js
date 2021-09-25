export default [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "Genel Bakış",
        to: "/dashboard",
        icon: "cil-speedometer"
      },
      {
        _name: "CSidebarNavTitle",
        _children: ["Tanımlamalar"]
      },
      {
        _name: "CSidebarNavItem",
        name: "Kullanıcı Ayarları",
        to: "/user-profile",
        icon: "cil-drop"
      },
      {
        _name: "CSidebarNavItem",
        name: "İşletme Ayarları",
        to: "/company",
        icon: "cil-drop"
      },
      {
        _name: "CSidebarNavItem",
        name: "Masalarım",
        to: "/tables",
        icon: "cil-drop"
      },
      {
        _name: "CSidebarNavItem",
        name: "Kategorilerim",
        to: "/categories",
        icon: "cil-pencil"
      },
      {
        _name: "CSidebarNavItem",
        name: "Ürünlerim",
        to: "/products",
        icon: "cil-pencil"
      }
    ]
  }
];
