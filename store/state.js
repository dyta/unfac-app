export default () => ({
  user: null,
  auth: null,
  line: null,
  loading: true,
  source: false,
  package: null,
  sidebarOpen: false,
  shopItems: [{
      name: "คำสั่งซื้อ",
      img: "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbasket.png?alt=media&token=0087794c-7703-44b1-90c0-b4ca7f2c541f",
      path: "#"
    },
    {
      name: "การชำระเงิน",
      icon: "dollar-sign",
      color: "orange",
      path: "#"
    },
    {
      name: "การจัดส่ง",
      img: "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fbox.png?alt=media&token=5adfa62c-70ca-434b-bba7-7f5fb6623927",
      path: "#"
    }
  ],
  accountList: [{
      name: "พนักงาน",
      img: "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fgirl2.png?alt=media&token=0f2c2b73-5f70-4376-8367-24e20655a97f",
      path: "/user/employees"
    },
    {
      name: "Collaborators",
      icon: "comment-medical",
      color: "orange",
      path: "/user/collaborators"
    }
  ],
  manufacItems: [{
      name: "งาน",
      img: "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fdoc.png?alt=media&token=5a4fde8a-b8a4-41cb-abb2-10afb3f38ee4",
      path: "/work-offer"
    },
    {
      name: "อนุมัติคำขอ",
      icon: "check",
      color: "teal",
      path: "/request"
    },
    {
      name: "ประกาศงาน",
      icon: "bell",
      color: "green",
      path: "#"
    },
    {
      name: "การผลิต",
      img: "https://firebasestorage.googleapis.com/v0/b/auntie-and-me.appspot.com/o/images%2Ficons%2Fprojector.png?alt=media&token=aae71cbe-4de4-41b0-9ac0-e2005f871416",
      path: "/manufacture"
    },
    {
      name: "สรุปงาน",
      icon: "chart-line",
      color: "brown",
      path: "#"
    }
  ]
})
