export const bookmarks = [
    {
      title: "jenkins",
      children: ["jenkins-개발/통시", "jenkins-운영"]
    },
    {
      title: "argoCD",
      children: ["argoCD-개발/통시", "argoCD-운영"]
    },
    // {
    //   title: "swagger",
    //   children: []
    // }
  ]

  
export const tabs = bookmarks.map((bm) => bm.title)
  