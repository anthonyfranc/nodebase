export default defineAppConfig({
    ui: {
      primary: 'green',
      gray: 'zinc',
      fonts: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      },
      button: {
        default: {
          loadingIcon: 'i-ph-spinner'
        }
      },
      input: {
        default: {
          loadingIcon: 'i-ph-spinner'
        }
      },
      select: {
        default: {
          loadingIcon: 'i-ph-spinner',
          trailingIcon: 'i-ph-caret-down'
        }
      },
      selectMenu: {
        default: {
          selectedIcon: 'i-ph-check'
        }
      },
      notification: {
        position: 'top-0 right-0',
        default: {
          closeButton: {
            icon: 'i-ph-x'
          }
        }
      },
      commandPalette: {
        default: {
          icon: 'i-ph-magnifying-glass-duotone',
          loadingIcon: 'i-ph-spinner',
          selectedIcon: 'i-ph-check',
          emptyState: {
            icon: 'i-ph-magnifying-glass-duotone'
          },
          closeButton: {
            icon: 'i-ph-x'
          }
        }
      },
      table: {
        default: {
          sortAscIcon: 'i-ph-sort-ascending',
          sortDescIcon: 'i-ph-sort-descending',
          sortButton: {
            icon: 'i-ph-list'
          },
          loadingState: {
            icon: 'i-ph-spinner'
          },
          emptyState: {
            icon: 'i-ph-database'
          }
        }
      },
      pagination: {
        default: {
          prevButton: {
            icon: 'i-ph-arrow-left'
          },
          nextButton: {
            icon: 'i-ph-arrow-right'
          }
        }
      },
      card: {
        rounded: 'rounded-xl'
      },
      tooltip: {
        background: '!bg-background',
      },
      breadcrumb: {
        divider: {
          base: 'w-4 h-4'
        },
        default: {
          divider: 'i-ph-caret-right'
        }
      },
      icons: {
        dark: 'i-ph-moon-duotone',
        light: 'i-ph-sun-duotone',
        search: 'i-ph-magnifying-glass-duotone',
        external: 'i-ph-arrow-up-right',
        chevron: 'i-ph-caret-down',
        hash: 'i-ph-hash-duotone'
      },
      navigation: {
        accordion: {
          button: {
            trailingIcon: {
              base: 'w-4 h-4'
            }
          }
        }
      },
      page: {
        card: {
          to: 'dark:hover:bg-gray-900/50'
        }
      },
      content: {
        search: {
          fileIcon: {
            name: 'i-ph-file-text-duotone'
          }
        },
        toc: {
          button: {
            trailingIcon: {
              base: 'w-4 h-4'
            }
          }
        },
        surround: {
          icon: {
            prev: 'i-ph-arrow-left',
            next: 'i-ph-arrow-right'
          }
        },
        collapsible: {
          button: {
            icon: {
              base: 'w-3 h-3'
            }
          }
        },
        prose: {
          code: {
            button: {
              icon: {
                copy: 'i-ph-copy-duotone',
                copied: 'i-ph-check-square-duotone'
              }
            },
            icon: {
              terminal: 'i-ph-terminal-window-duotone'
            }
          }
        }
      }
    }
  })