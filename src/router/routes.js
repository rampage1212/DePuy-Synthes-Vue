import { DEFAULT_DEPARTMENT } from '@/utils/constants.js'

export default [
  { path: '/', redirect: { name: 'dashboard' } },
  {
    path: '/dashboard',
    redirect: {
      name: 'dashboard',
      params: { department: DEFAULT_DEPARTMENT },
    },
  },
  {
    path: '/login',
    name: 'defaultLogin',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Login',
      isPublic: true,
    },
  },
  {
    path: '/:department/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Login',
      isPublic: true,
    },
  },
  {
    path: '/:department/new-password',
    name: 'newPassword',
    component: () => import('@/views/auth/NewPasswordView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'New Password',
      isPublic: true,
    },
  },
  {
    path: '/:department?/forgot-password',
    name: 'forgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Reset Password',
      isPublic: true,
    },
  },
  {
    path: '/:department?/reset-password',
    name: 'resetPassword',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Reset Password',
      isPublic: true,
    },
  },
  {
    path: '/:department?/dashboard',
    name: 'dashboard',
    component: () => import('@/views/home/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  {
    // step 1
    path: '/:department/new-presentation',
    name: 'new-presentation',
    component: () => import('@/views/newRfp/NewRfpView.vue'),
    meta: {
      title: 'Create Presentation',
    },
  },
  {
    // start RFP
    path: '/:department/new-presentation/:templateId',
    name: 'new-presentation-template',
    component: () => import('@/views/newRfp/NewRfpView.vue'),
  },
  {
    // step 1 to 6
    path: '/:department/update-presentation/:presentationId/:step',
    name: 'update-presentation',
    component: () => import('@/views/newRfp/NewRfpView.vue'),
    meta: {
      title: 'Update Presentation Details',
    },
  },
  {
    path: '/:department/presentation/:presentationId/printOverview',
    name: 'printOverview',
    component: () => import('@/views/newRfp/SlideOverviewPrintPreview.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Update Presentation Details',
      isPublic: true,
    },
  },
  {
    // step 1 to 6
    path: '/:department/update-presentation/:presentationId/:step/custom-slides/:selectionType/:slideStep',
    name: 'presentation-create-custom-slide',
    component: () => import('@/components/newRfp/CustomSlideStep.vue'),
    meta: {
      title: 'Create custom slide for presentation',
    },
  },
  {
    // step 1 to 6
    path: '/:department/update-presentation/:presentationId/:step/custom-slides/edit/:customSlideId/:slideStep',
    name: 'presentation-update-custom-slide',
    component: () => import('@/components/newRfp/CustomSlideStep.vue'),
    meta: {
      title: 'Update custom slide for presentation',
    },
  },
  {
    path: '/:department/my-presentations',
    name: 'my-presentations',
    component: () => import('@/views/MyRfpsView.vue'),
    meta: {
      title: 'My Presentations',
    },
  },
  {
    path: '/:department/published',
    name: 'published',
    component: () => import('@/views/PublishedLinksView.vue'),
    meta: {
      title: 'Published Links',
    },
  },
  {
    path: '/:department/builder/:presentationId/:slideId',
    name: 'builder',
    component: () => import('@/views/builder/builderView.vue'),
    meta: {
      title(to) {
        return `Builder | ${to.params.slideId || ''}`
      },
    },
  },
  {
    path: '/:department/create-link/:presentationId',
    name: 'create-link',
    component: () => import('@/views/newRfp/CreateLinkView.vue'),
    meta: {
      title: 'Create Link',
    },
  },
  {
    path: '/:department/update-link/:presentationId/:linkId',
    name: 'update-link',
    component: () => import('@/views/newRfp/CreateLinkView.vue'),
    meta: {
      title: 'Update Link',
    },
  },
  {
    path: '/:department/templates',
    name: 'templates',
    component: () => import('@/views/templates/TemplatesView.vue'),
  },
  {
    path: '/:department/templates/new',
    name: 'templates-new',
    component: () => import('@/views/templates/CreateTemplatesView.vue'),
  },
  {
    path: '/:department/templates/:templateID',
    name: 'templates-edit',
    component: () => import('@/views/templates/EditTemplatesView.vue'),
  },
  {
    path: '/:department/shared-with-me',
    name: 'shared-with-me',
    component: () => import('@/views/SharedWithMeView.vue'),
  },
  {
    path: '/:department/resources',
    name: 'resources',
    component: () => import('@/views/resources/ResourcesView.vue'),
    meta: {
      title: 'Resources',
    },
  },
  {
    path: '/:department/resources/:folderName',
    name: 'resources-folder',
    component: () => import('@/components/resources/items/NestFolder.vue'),
    meta: {
      title: 'Resources',
    },
  },
  {
    path: '/:department?/settings/profile',
    name: 'settings-profile',
    component: () => import('@/views/setting/ProfileBody.vue'),
    // component: () => import("@/views/setting/ProfileBody.vue"),
    meta: {
      title: 'Profile',
    },
  },
  {
    path: '/:department/settings/email-body',
    name: 'settings-email-body',
    component: () => import('@/views/setting/EmailBody.vue'),
    meta: {
      title: 'Email Body',
    },
  },
  {
    path: '/:department/settings/custom-slides',
    name: 'settings-custom-slides',
    component: () => import('@/views/setting/CustomSlides.vue'),
    meta: {
      title: 'Custome slides',
    },
  },
  {
    path: '/:department/settings/custom-slides/create/:slideStep',
    name: 'create-custom-slide',
    component: () => import('@/components/newRfp/CustomSlideStep.vue'),
    meta: {
      title: 'Create Custome Slide',
    },
  },
  {
    path: '/:department/settings/custom-slides/edit/:customSlideId/:slideStep',
    name: 'update-custom-slide',
    component: () => import('@/components/newRfp/CustomSlideStep.vue'),
    meta: {
      title: 'Update Custome Slide',
    },
  },
  {
    // Deprecated Path
    path: '/:department?/settings/deprecated-change-password',
    name: 'settings-change-password',
    component: () => import('@/views/setting/deprecated_ChangePassword.vue'),
    meta: {
      title: 'Change Password',
    },
  },

  {
    path: '/:department?/support',
    name: 'support',
    component: () => import('@/views/support/supportView.vue'),
    meta: {
      title: 'Support',
      isPublic: true,
    },
  },
  {
    path: '/:department/view/29107879HTYI89',
    name: 'clientLogin',
    component: () => import('@/views/client/ClientLoginView.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Welcome',
    },
  },
  {
    path: '/:department/preface',
    name: 'preface',
    component: () => import('@/views/PrefaceView.vue'),
    meta: {
      layout: 'layout-default',
    },
  },
  {
    path: '/:department/slideOverview/:presentationId/:slideId',
    name: 'slideOverview',
    component: () => import('@/views/slides/slideOverview.vue'),
    meta: {
      layout: 'layout-default',
      title: 'slide overview',
    },
  },
  {
    path: '/:department/linkOverview/:clientName/:hyperLink/:slideId',
    name: 'linkOverview',
    component: () => import('@/views/slides/slideOverview.vue'),
    meta: {
      layout: 'layout-default',
      title: 'slide overview',
    },
  },
  {
    path: '/:department/slide/:presentationId',
    name: 'slide',
    component: () => import('@/views/slides/PresentationView.vue'),
    meta: {
      layout: 'layout-default',
      title(to) {
        return `Slide ${to.hash?.slice(2) || ''}`
      },
    },
  },
  {
    path: '/:department/present/:clientName/:hyperLink',
    name: 'present',
    component: () => import('@/views/slides/PresentationView.vue'),
    meta: {
      layout: 'layout-default',
      title(to) {
        return `Slide ${to.hash?.slice(2) || ''}`
      },
    },
  },
  {
    path: '/:department/present/:clientName/:hyperLink/pdf',
    name: 'present-pdf',
    component: () => import('@/views/slides/PresentationViewPDF.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Slide Print PDF',
    },
  },
  {
    path: '/:department/present/:clientName/:hyperLink/printPdf',
    name: 'print-pdf',
    component: () => import('@/views/slides/PresentationViewPDF.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Slide Print PDF',
      isPublic: true,
    },
  },
  {
    path: '/:department/slide/:presentationId/pdf',
    name: 'slide-pdf',
    component: () => import('@/views/slides/PresentationViewPDF.vue'),
    meta: {
      layout: 'layout-default',
      title: 'Slide Print PDF',
    },
  },
  {
    path: '/:department',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/NotFound404.vue'),
    meta: {
      title: '404',
    },
  },
]
