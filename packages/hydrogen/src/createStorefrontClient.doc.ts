import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'createStorefrontClient',
  category: 'utilities',
  isVisualComponent: false,
  related: [
    {
      name: 'CacheNone',
      type: 'utilities',
      url: '/docs/api/hydrogen/2023-04/utilities/cachenone',
    },
    {
      name: 'CacheShort',
      type: 'utilities',
      url: '/docs/api/hydrogen/2023-04/utilities/cacheshort',
    },
    {
      name: 'CacheLong',
      type: 'utilities',
      url: '/docs/api/hydrogen/2023-04/utilities/cachelong',
    },
    {
      name: 'CacheCustom',
      type: 'utilities',
      url: '/docs/api/hydrogen/2023-04/utilities/cachecustom',
    },
  ],
  description: `This function extends \`createStorefrontClient\` from [Hydrogen React](/docs/api/hydrogen-react/2023-04/utilities/createstorefrontclient). The additional arguments enable internationalization (i18n), caching, and other features particular to Remix and Oxygen.

Learn more about [data fetching in Hydrogen](/docs/custom-storefronts/hydrogen/data-fetching/fetch-data).`,
  type: 'utility',
  defaultExample: {
    description: 'I am the default example',
    codeblock: {
      tabs: [
        {
          title: 'JavaScript',
          code: './storefrontClient.example.js',
          language: 'js',
        },
        {
          title: 'TypeScript',
          code: './storefrontClient.example.ts',
          language: 'ts',
        },
      ],
      title: 'Example code',
    },
  },
  definitions: [
    {
      title: 'Arguments',
      type: 'CreateStorefrontClientGeneratedType',
      description: '',
    },
  ],
};

export default data;
