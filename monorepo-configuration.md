

# Configuring monorepo build settings
<a name="monorepo-configuration"></a>

When you store multiple projects or microservices in a single repository, it is called a monorepo. You can use Amplify Hosting to deploy applications in a monorepo without creating multiple build configurations or branch configurations.

Amplify supports apps in generic monorepos as well as apps in monorepos created using npm workspace, pnpm workspace, Yarn workspace, Nx, and Turborepo. When you deploy your app, Amplify automatically detects the monorepo build tool that you are using. Amplify automatically applies build settings for apps in an npm workspace, Yarn workspace or Nx. Turborepo and pnpm apps require additional configuration. For more information, see [Configuring Turborepo and pnpm monorepo apps](#turborepo-pnpm-monorepo-configuration).

You can save the build settings for a monorepo in the Amplify console or you can download the `amplify.yml` file and add it to the root of your repository. Amplify applies the settings saved in the console to all of your branches unless it finds an `amplify.yml` file in your repository. When an `amplify.yml` file is present, its settings override any build settings saved in the Amplify console.

## Monorepo build specification YAML syntax reference
<a name="monorepo-yml-syntax"></a>

The YAML syntax for a monorepo build specification differs from the YAML syntax for a repo that contains a single application. For a monorepo, you declare each project in a list of applications. You must provide the following additional `appRoot` key for each application you declare in your monorepo build specification:

**appRoot**  
The root, within the repository, that the application starts in. This key must exist, and have the same value as the `AMPLIFY_MONOREPO_APP_ROOT` environment variable. For instructions on setting this environment variable, see [Setting the AMPLIFY\$1MONOREPO\$1APP\$1ROOT environment variable](#setting-monorepo-environment-variable).

The following monorepo build specification example demonstrates how to declare multiple Amplify applications in the same repo. The two apps, `react-app`, and `angular-app` are declared in the `applications` list. The `appRoot` key for each app indicates that the app is located in the `apps` root folder in the repo.

The `buildpath` attribute is set to `/` to run and build the app from the monorepo project root. The `baseDirectory` attribute is the relative path of `buildpath`.

### Monorepo build specification YAML syntax
<a name="monorepo-build-yaml-syntax"></a>

```
version: 1
applications:
  - appRoot: apps/react-app
    env:
      variables:
        key: value
    backend:
      phases:
        preBuild:
          commands:
            - *enter command*
        build:
          commands:
            - *enter command*
        postBuild:
            commands:
            - *enter command*
    frontend:
      buildPath: / # Run install and build from the monorepo project root
      phases:
        preBuild:
          commands:
            - *enter command*
            - *enter command*
        build:
          commands:
            - *enter command*
      artifacts:
        files:
            - location
            - location
        discard-paths: yes
        baseDirectory: location
      cache:
        paths:
            - path
            - path
    test:
      phases:
        preTest:
          commands:
            - *enter command*
        test:
          commands:
            - *enter command*
        postTest:
          commands:
            - *enter command*
      artifacts:
        files:
            - location
            - location
        configFilePath: *location*
        baseDirectory: *location*
  - appRoot: apps/angular-app
    env:
      variables:
        key: value
    backend:
      phases:
        preBuild:
          commands:
            - *enter command*
        build:
          commands:
            - *enter command*
        postBuild:
            commands:
            - *enter command*
    frontend:
      phases:
        preBuild:
          commands:
            - *enter command*
            - *enter command*
        build:
          commands:
            - *enter command*
      artifacts:
        files:
            - location
            - location
        discard-paths: yes
        baseDirectory: location
      cache:
        paths:
            - path
            - path
    test:
      phases:
        preTest:
          commands:
            - *enter command*
        test:
          commands:
            - *enter command*
        postTest:
          commands:
            - *enter command*
      artifacts:
        files:
            - location
            - location
        configFilePath: *location*
        baseDirectory: *location*
```

An app using the following example build specification, will be built under the project root and the build artifacts will be located at `/packages/nextjs-app/.next`.

```
applications:
  - frontend:
      buildPath: '/'  # run install and build from monorepo project root
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build --workspace=nextjs-app
      artifacts:
        baseDirectory: packages/nextjs-app/.next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    appRoot: packages/nextjs-app
```

## Setting the AMPLIFY\$1MONOREPO\$1APP\$1ROOT environment variable
<a name="setting-monorepo-environment-variable"></a>

When you deploy an app stored in a monorepo, the app's `AMPLIFY_MONOREPO_APP_ROOT` environment variable must have the same value as the path of the app root, relative to the root of your repository. For example, a monorepo named `ExampleMonorepo` with a root folder named `apps`, that contains, `app1`, `app2`, and `app3` has the following directory structure:

```
ExampleMonorepo
  apps
    app1
    app2
    app3
```

In this example, the value of the `AMPLIFY_MONOREPO_APP_ROOT` environment variable for `app1` is `apps/app1`.

When you deploy a monorepo app using the Amplify console, the console automatically sets the `AMPLIFY_MONOREPO_APP_ROOT` environment variable using the value that you specify for the path to the app's root. However, if your monorepo app already exists in Amplify or is deployed using AWS CloudFormation, you must manually set the `AMPLIFY_MONOREPO_APP_ROOT` environment variable in the **Environment variables** section in the Amplify console.

### Setting the AMPLIFY\$1MONOREPO\$1APP\$1ROOT environment variable automatically during deployment
<a name="setting-monorepo-environmnet-variable-automatically"></a>

The following instructions demonstrate how to deploy a monorepo app with the Amplify console. Amplify automatically sets the `AMPLIFY_MONOREPO_APP_ROOT` environment variable using the app's root folder that you specify in the console.

**To deploy a monorepo app with the Amplify console**

1. Sign in to the AWS Management Console and open the [Amplify console](https://console.aws.amazon.com/amplify/).

1. Choose **Create new app** in the upper right corner.

1. On the **Start building with Amplify** page, choose your Git provider, then choose **Next**.

1. On the **Add repository branch** page, do the following:

   1. Choose the name of your repository from the list.

   1. Choose the name of the branch to use.

   1. Select **My app is a monorepo**

   1. Enter the path to your app in your monorepo, for example, **apps/app1**.

   1. Choose **Next**.

1. On the **App settings** page, you can use the default settings or customize the build settings for your app. In the **Environment variables** section, Amplify sets `AMPLIFY_MONOREPO_APP_ROOT` to the path you specified in step 4d.

1. Choose **Next**.

1. On the **Review** page, choose **Save and deploy**.

### Setting the AMPLIFY\$1MONOREPO\$1APP\$1ROOT environment variable for an existing app
<a name="setting-monorepo-environment-variable-manually"></a>

Use the following instructions to manually set the `AMPLIFY_MONOREPO_APP_ROOT` environment variable for an app that is already deployed to Amplify, or has been created using CloudFormation.

**To set the AMPLIFY\$1MONOREPO\$1APP\$1ROOT environment variable for an existing app**

1. Sign in to the AWS Management Console and open the [Amplify console](https://console.aws.amazon.com/amplify/).

1. Choose the name of the app to set the environment variable for.

1. In the navigation pane, choose **Hosting**, and then choose **Environment variables**.

1. On the **Environment variables** page, choose **Manage variables**.

1. In the **Manage variables** section, do the following:

   1. Choose **Add new**.

   1. For **Variable**, enter the key `AMPLIFY_MONOREPO_APP_ROOT`.

   1. For **Value**, enter the path to the app, for example **apps/app1**.

   1. For **Branch**, by default Amplify applies the environment variable to all branches.

1. Choose **Save**.

## Configuring Turborepo and pnpm monorepo apps
<a name="turborepo-pnpm-monorepo-configuration"></a>

The Turborepo and pnpm workspace monorepo build tools get configuration information from `.npmrc` files. When you deploy a monorepo app created with one of these tools, you must have an `.npmrc` file in your project root directory.

In the `.npmrc` file, set the linker for installing Node packages to `hoisted`. You can copy the following line to your file.

```
node-linker=hoisted
```

For more information about `.npmrc` files and settings, see [pnpm .npmrc](https://pnpm.io/next/npmrc) in the *pnpm documentation*.

Pnpm is not included in the Amplify default build container. For pnpm workspace and Turborepo apps, you must add a command to install pnpm in the `preBuild` phase of your app's build settings.

The following example excerpt from a build specification shows a `preBuild` phase with a command to install pnpm.

```
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm install -g pnpm
```
