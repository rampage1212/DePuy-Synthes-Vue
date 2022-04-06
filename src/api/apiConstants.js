export default function apiConstants(stage = 'staging') {
  return {
    VITE_API_ENDPOINT:
      stage === 'dev'
        ? 'https://main.dimqgfena0ngf.amplifyapp.com/api/'
        : 'https://main.do1we242kszh.amplifyapp.com/api/',
    VITE_IDENTITY_POOL_ID:
      stage === 'dev'
        ? 'us-east-1:77254f14-c68c-4af8-b6c8-42a9dbcdacc6'
        : 'us-east-1:23aec86d-d841-41a1-bf71-12d002b42a9c',
    VITE_USER_POOL_ID:
      stage === 'dev' ? 'us-east-1_k7g2mExIL' : 'us-east-1_FfUz6EhCT',
    VITE_USER_POOL_WEB_CLIENT_ID:
      stage === 'dev'
        ? '1o4efk694p6odt4bat9loam59k'
        : '514gkm40fkq29t1sfjj9caqj9r',
    VITE_S3_BUCKET: `${stage}-gladiator-assets`,
  }
}
