import delegate from 'delegates'

delegate(exports, 'response')
  .method('cc')
  .method('cacheControl')
  .method('send')
