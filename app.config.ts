export default defineAppConfig({
    ui: {
      primary: 'green',
      gray: 'zinc',
      fonts: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      },
      tooltip: {
        default: {
          openDelay: 500
        }
      },
      icons: {
        dynamic: true,
        dark: 'bi:moon-stars-fill',
        light: 'icon-park-outline:sun'
      },
      notifications: {
        position: 'top-0 top-auto'
      }
    }
  })