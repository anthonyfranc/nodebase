export default defineAppConfig({
    ui: {
      primary: 'green',
      gray: 'zinc',
      tooltip:{
        default:{
            openDelay: 500
        }
      },
      icons: {
        dynamic: true,
        dark: 'bi:moon-stars-fill',
        light: 'icon-park-outline:sun'
      },
      notifications: {
        position: 'top-0 bottom-auto'
      }
    }
  })