import type { ProjectConfig, ProjectStructure } from '../types';

export const generateProject = (config: ProjectConfig): ProjectStructure => {
  const files: { path: string; content: string }[] = [];

  // Generate project-level files
  if (config.useKotlinDsl) {
    // Add build.gradle.kts (project level)
    files.push({
      path: 'build.gradle.kts',
      content: generateBuildGradleKts(config),
    });

    // Add settings.gradle.kts
    files.push({
      path: 'settings.gradle.kts',
      content: generateSettingsGradleKts(config),
    });

    // Add app/build.gradle.kts
    files.push({
      path: 'app/build.gradle.kts',
      content: generateAppBuildGradleKts(config),
    });

    // Add libs.versions.toml (version catalog)
    files.push({
      path: 'gradle/libs.versions.toml',
      content: generateLibsVersionsToml(config),
    });
  } else {
    // Add build.gradle (project level)
    files.push({
      path: 'build.gradle',
      content: generateBuildGradle(config),
    });

    // Add settings.gradle
    files.push({
      path: 'settings.gradle',
      content: generateSettingsGradle(config),
    });

    // Add app/build.gradle
    files.push({
      path: 'app/build.gradle',
      content: generateAppBuildGradle(config),
    });
  }

  // Generate AndroidManifest.xml
  files.push({
    path: 'app/src/main/AndroidManifest.xml',
    content: generateAndroidManifest(config),
  });

  // Generate MainActivity (Compose or XML)
  // Always use Compose UI
  files.push({
    path: 'app/src/main/java/' + config.packageName.replace(/\./g, '/') + '/MainActivity.kt',
    content: generateMainActivityCompose(config),
  });

  // Generate theme files
  const themePath = 'app/src/main/java/' + config.packageName.replace(/\./g, '/') + '/ui/theme/';

  files.push({
    path: themePath + 'Theme.kt',
    content: generateThemeKt(config),
  });

  files.push({
    path: themePath + 'Color.kt',
    content: generateColorKt(config),
  });

  files.push({
    path: themePath + 'Type.kt',
    content: generateTypeKt(config),
  });

  // Always generate Hilt Application class
  files.push({
    path: 'app/src/main/java/' + config.packageName.replace(/\./g, '/') + '/MyApplication.kt',
    content: generateHiltApplication(config),
  });

  // Add MVVM architecture files
  addMvvmFiles(files, config);

  // Add README.md
  files.push({
    path: 'README.md',
    content: generateReadme(config),
  });

  // Add gradle.properties with AndroidX configuration
  files.push({
    path: 'gradle.properties',
    content: `# Project-wide Gradle settings.
# IDE (e.g. Android Studio) users:
# Gradle settings configured through the IDE *will override*
# any settings specified in this file.
# For more details on how to configure your build environment visit
# http://www.gradle.org/docs/current/userguide/build_environment.html
# Specifies the JVM arguments used for the daemon process.
# The setting is particularly useful for tweaking memory settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
# When configured, Gradle will run in incubating parallel mode.
# This option should only be used with decoupled projects. More details, visit
# http://www.gradle.org/docs/current/userguide/multi_project_builds.html#sec:decoupled_projects
# org.gradle.parallel=true
# AndroidX package structure to make it clearer which packages are bundled with the
# Android operating system, and which are packaged with your app's APK
# https://developer.android.com/topic/libraries/support-library/androidx-rn
android.useAndroidX=true
# Automatically convert third-party libraries to use AndroidX
android.enableJetifier=true
# Kotlin code style for this project: "official" or "obsolete":
kotlin.code.style=official
# Enables namespacing of each library's R class so that its R class includes only the
# resources declared in the library itself and none from the library's dependencies,
# thereby reducing the size of the R class for that library
android.nonTransitiveRClass=true`,
  });

  // Add essential resource files

  // Add values/strings.xml
  files.push({
    path: 'app/src/main/res/values/strings.xml',
    content: `<resources>
    <string name="app_name">${config.projectName}</string>
</resources>`,
  });

  // Add values/colors.xml
  files.push({
    path: 'app/src/main/res/values/colors.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>`,
  });

  // Add values/themes.xml - always use Compose theme
  files.push({
    path: 'app/src/main/res/values/themes.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.${config.projectName.replace(/[^a-zA-Z0-9]/g, '')}" parent="android:Theme.Material.Light.NoActionBar" />
</resources>`,
  });

  // Add data extraction rules XML
  files.push({
    path: 'app/src/main/res/xml/data_extraction_rules.xml',
    content: `<?xml version="1.0" encoding="utf-8"?><!--
   Sample data extraction rules file; uncomment and customize as necessary.
   See https://developer.android.com/about/versions/12/backup-restore#xml-changes
   for details.
-->
<data-extraction-rules>
    <cloud-backup>
        <!-- TODO: Use <include> and <exclude> to control what is backed up.
        <include .../>
        <exclude .../>
        -->
    </cloud-backup>
    <!--
    <device-transfer>
        <include .../>
        <exclude .../>
    </device-transfer>
    -->
</data-extraction-rules>`,
  });

  // Add backup rules XML
  files.push({
    path: 'app/src/main/res/xml/backup_rules.xml',
    content: `<?xml version="1.0" encoding="utf-8"?><!--
   Sample backup rules file; uncomment and customize as necessary.
   See https://developer.android.com/guide/topics/data/autobackup
   for details.
   Note: This file is ignored for devices older than API 31
   See https://developer.android.com/about/versions/12/backup-restore
-->
<full-backup-content>
    <!--
   <include domain="sharedpref" path="."/>
   <exclude domain="sharedpref" path="device.xml"/>
-->
</full-backup-content>`,
  });

  // Add launcher icon XML and vector drawable resources
  files.push({
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`,
  });

  files.push({
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`,
  });

  // Add launcher background vector drawable
  files.push({
    path: 'app/src/main/res/drawable/ic_launcher_background.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#3DDC84"
        android:pathData="M0,0h108v108h-108z" />
    <path
        android:fillColor="#00000000"
        android:pathData="M9,0L9,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,0L19,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M29,0L29,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M39,0L39,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M49,0L49,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M59,0L59,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M69,0L69,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M79,0L79,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M89,0L89,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M99,0L99,108"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,9L108,9"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,19L108,19"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,29L108,29"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,39L108,39"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,49L108,49"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,59L108,59"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,69L108,69"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,79L108,79"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,89L108,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,99L108,99"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,29L89,29"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,39L89,39"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,49L89,49"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,59L89,59"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,69L89,69"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M19,79L89,79"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M29,19L29,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M39,19L39,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M49,19L49,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M59,19L59,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M69,19L69,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
    <path
        android:fillColor="#00000000"
        android:pathData="M79,19L79,89"
        android:strokeWidth="0.8"
        android:strokeColor="#33FFFFFF" />
</vector>`,
  });

  // Add launcher foreground vector drawable
  files.push({
    path: 'app/src/main/res/drawable/ic_launcher_foreground.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108"
    android:tint="#FFFFFF">
  <group android:scaleX="2.61"
      android:scaleY="2.61"
      android:translateX="22.68"
      android:translateY="22.68">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M17.6,11.48 L19.44,8.3a0.63,0.63 0,0 0,-1.09 -0.63l-1.88,3.24a11.43,11.43 0,0 0,-8.94 0L5.65,7.67a0.63,0.63 0,0 0,-1.09 0.63L6.4,11.48A10.81,10.81 0,0 0,1 20L23,20A10.81,10.81 0,0 0,17.6 11.48ZM7,17.25A1.25,1.25 0,1 1,8.25 16,1.25 1.25,0 0,1 7,17.25ZM17,17.25A1.25,1.25 0,1 1,18.25 16,1.25 1.25,0 0,1 17,17.25Z"/>
  </group>
</vector>`,
  });

  // Add launcher icons as webp files
  const iconData = `iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE0klEQVR4nO2ZbUxbZRjHT9cYjIkfjDF+UPPFZH7wi9n84BcTtqjJlhk3E6PZZsQPS1xcNBmZcXMuZlsEGZtzZMzCNByMybIJIyBjkAK90VJaaHt7e3t7z2lPe3vb0/dy7Glt9720p7fVhbDEJ3mSJs95/v/nd57zvA/Jw+FwBx2/YxJ8YszyzxUjf0/k+D9A4oV34bCGf8Dx+Sce488QZ9gfpPg1S3fDWEAhWlgIkMJh4gzGRZ4XwmCZwMETCw8zPH+rp7v7VYlE8o3JZOqAAR/7JnMdJlPH5cuXv5FKpW92dXW9WOL4NSLPgzfD8A5+GRzYZzAY6mtra+H06dOg1WpBLpcjYxz4e4lEcnL92lrvyLyGIAXhFKk0GN6j6dSeAckkHD9+PGs8A/L32trawO/zvZGrT4/b/XNJApIk+0wm00MIfPr06axQCPzW7M7r9fV9iesnFAodKirg8OHDgOFRK86cOZMVhgA4Ho+DzWa7hRuTSCQOFBUQjUYhEAhAX19fHjgE0nNGo9GrOI1JNBpNFxVw7NixrHgIPHnyJM8iBP78y2Phek61t4vKsoAzZ85khUXA6dOnEXwcjb29vT8WnkKS9GIwGARYXl7OS58ICMGRjkgk0k+S5K3CHbjJ5XK/+qZjIRAOh8Hr9SYUV678Wd/Q8D4MJuU4+Hl9PJGAsAiPAJ/P9wjXj9/vryobQOJ0nTaZRvN6QFZX13zx/n1Tz9/b88XwHV9d/Rbb19TU1CTuwr6+vpIHQ9TDV4F3dnbKC3qgr6/vYXVVFTQ2NkJ1dXXGG/Q8zAbWJvvV1tYO7e3tjoIAPT09yTffLlmk5+UWpQ0FLQFxXLuufhQXJLe5Q5ubxAW1Wj0gXrYZ4KdPfmS1WlFaREqxQnB2u91v/1JV9cVOeTweP0TTNPhptpehKCCXyWhZl0pDU1NTe4XAl5eXoVQrQWVZS+jW+npYWFhIQNFEIAZiIaZkgIGBgX0lsQcF+P1+WCVJmJubS0DR1NzcDIiJmAUB4vH4EQzgnsfjJPv7fw1FQyFyZmbtDUHlU4aNjY0gDoBi3TDb7f9EZTLpkFKpjHZ2dtYXhcOgJD5y+PBhIAhiyqqrJTNzc3PlA2hvfyQqk0rFdl1dHQwODIjyO61QKHDwhN/vnygfAEmSP/l8Hl9TUxOcPfsRymkcPM3k5DhiiTFLBWDdbjdyqYmJiXkfRX0bpihbS3PzHfF4PPZSQ0PDcUyqNRZlbvZZrfNl84DBYPgSt4CPj4/D8+fP08ViMbDb7ShFKwEi6+sHWZadKxtAo9E8xgEolUqYnp7OCsMFTk1JlMsrKzG5XF5fCYD3cQDDw8N5sAxwZv/hw+GyjsRVVVVvcfbV5OQkLrlRxnM7Vq1WX8+1t9Tp9IvlBCDdbjfXD1qt1ivce1P6b+i+jfWpMgCCwWDIYDDAhQsXMuCKi4vv8Yd+y+Vy/0KaZrx27fr1GYKgPHq9XnzlypVpgiCeJt+rJx4Oh2NFwWO3BI7jt3U63YRWq0VlGJVm5HCtra21c7mcXalU2JaWlr4uc//iQhyORDabkOe3j4SIrfTnYJaXV54Eg8FWnucrbCf7lN5ObtnnX+T+BTuJ0K+ifuG2AAAAAElFTkSuQmCC`;

  // Add webp versions of the launcher icons
  const webpFiles = [
    'mipmap-mdpi/ic_launcher.webp',
    'mipmap-mdpi/ic_launcher_round.webp',
    'mipmap-hdpi/ic_launcher.webp',
    'mipmap-hdpi/ic_launcher_round.webp',
    'mipmap-xhdpi/ic_launcher.webp',
    'mipmap-xhdpi/ic_launcher_round.webp',
    'mipmap-xxhdpi/ic_launcher.webp',
    'mipmap-xxhdpi/ic_launcher_round.webp',
    'mipmap-xxxhdpi/ic_launcher.webp',
    'mipmap-xxxhdpi/ic_launcher_round.webp'
  ];

  webpFiles.forEach(path => {
    files.push({
      path: `app/src/main/res/${path}`,
      content: iconData
    });
  });

  return {
    files,
  };
};

// Helper functions to generate different files

function generateLibsVersionsToml(config: ProjectConfig): string {
  return `[versions]
agp = "8.10.0"
kotlin = "2.0.21"
coreKtx = "1.16.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.9.0"
activityCompose = "1.10.1"
composeBom = "2024.09.00"
retrofit = "2.9.0"
okhttp = "4.12.0"
room = "2.6.1"
hilt = "2.48"
coil = "2.5.0"
coroutines = "1.7.3"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
${config.ui === 'xml' ? 'androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version = "1.6.1" }\nandroidx-constraintlayout = { group = "androidx.constraintlayout", name = "constraintlayout", version = "2.1.4" }\n' : ''}
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
retrofit-gson = { group = "com.squareup.retrofit2", name = "converter-gson", version.ref = "retrofit" }
okhttp-logging = { group = "com.squareup.okhttp3", name = "logging-interceptor", version.ref = "okhttp" }
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
coil = { group = "io.coil-kt", name = "coil", version.ref = "coil" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coil" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
material = { group = "com.google.android.material", name = "material", version = "1.11.0" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
${config.di === 'hilt' ? 'hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }\n' : ''}`;
}

function generateBuildGradleKts(config: ProjectConfig): string {
  return `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false${config.di === 'hilt' ? '\n    alias(libs.plugins.hilt) apply false' : ''}
}`;
}

function generateBuildGradle(config: ProjectConfig): string {
  return `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.10.0' apply false
    id 'org.jetbrains.kotlin.android' version '2.0.21' apply false
    id 'org.jetbrains.kotlin.plugin.compose' version '2.0.21' apply false${config.di === 'hilt' ? '\n    id \'com.google.dagger.hilt.android\' version \'2.48\' apply false' : ''}
}`;
}

function generateSettingsGradleKts(config: ProjectConfig): string {
  return `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${config.projectName}"
include(":app")`;
}

function generateSettingsGradle(config: ProjectConfig): string {
  return `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = '${config.projectName}'
include ':app'`;
}

function generateAppBuildGradleKts(config: ProjectConfig): string {
  // Determine if we need kapt
  const needsKapt = config.di === 'hilt' ||
                   config.database === 'room';

  // Format plugins
  let plugins = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)`;

  if (needsKapt) {
    plugins += `
    id("kotlin-kapt")`;
  }

  // Always add Hilt plugin
  plugins += `
    alias(libs.plugins.hilt)`;

  plugins += `
}`;

  // Generate dependencies section
  const dependencies = [];

  // Core dependencies
  dependencies.push(
    '    implementation(libs.androidx.core.ktx)',
    '    implementation(libs.androidx.lifecycle.runtime.ktx)',
  );

  // UI dependencies - always use Compose
  dependencies.push(
    '    implementation(libs.androidx.activity.compose)',
    '    implementation(platform(libs.androidx.compose.bom))',
    '    implementation(libs.androidx.ui)',
    '    implementation(libs.androidx.ui.graphics)',
    '    implementation(libs.androidx.ui.tooling.preview)',
    '    implementation(libs.androidx.material3)',
    '    debugImplementation(libs.androidx.ui.tooling)',
    '    debugImplementation(libs.androidx.ui.test.manifest)'
  );

  // Always use Retrofit for networking
  dependencies.push(
    '    implementation(libs.retrofit)',
    '    implementation(libs.retrofit.gson)',
    '    implementation(libs.okhttp.logging)'
  );

  // Always use Room for database
  dependencies.push(
    '    implementation(libs.room.runtime)',
    '    implementation(libs.room.ktx)',
    '    kapt(libs.room.compiler)'
  );

  // Always use Hilt for dependency injection
  dependencies.push(
    '    implementation(libs.hilt.android)',
    '    kapt(libs.hilt.compiler)'
  );

  // Always use Coil for image loading
  dependencies.push(
    '    implementation(libs.coil)',
    '    implementation(libs.coil.compose)'
  );

  // Always use Coroutines for async
  dependencies.push('    implementation(libs.kotlinx.coroutines.android)');


  // Testing
  dependencies.push(
    '    testImplementation(libs.junit)',
    '    androidTestImplementation(libs.androidx.junit)',
    '    androidTestImplementation(libs.androidx.espresso.core)'
  );

  // Always include Compose testing dependencies
  dependencies.push(
    '    androidTestImplementation(platform(libs.androidx.compose.bom))',
    '    androidTestImplementation(libs.androidx.ui.test.junit4)'
  );

  // Material
  dependencies.push('    implementation(libs.material)');

  return `${plugins}

android {
    namespace = "${config.packageName}"
    compileSdk = 35

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = ${config.minSdkVersion}
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    
    kotlinOptions {
        jvmTarget = "11"
    }
    
    buildFeatures {
        compose = true
    }
}

dependencies {
${dependencies.join('\n')}
}`;
}

function generateAppBuildGradle(config: ProjectConfig): string {
  // Helper to format the dependencies
  const dependencies: string[] = [
    "    implementation 'androidx.core:core-ktx:1.12.0'",
    "    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.7.0'",
    "    implementation 'androidx.activity:activity-ktx:1.8.2'",
  ];

  // Always use Compose UI
  dependencies.push(
    "    implementation 'androidx.activity:activity-compose:1.8.2'",
    "    implementation platform('androidx.compose:compose-bom:2023.10.00')",
    "    implementation 'androidx.compose.ui:ui'",
    "    implementation 'androidx.compose.ui:ui-graphics'",
    "    implementation 'androidx.compose.ui:ui-tooling-preview'",
    "    implementation 'androidx.compose.material3:material3'",
    "    debugImplementation 'androidx.compose.ui:ui-tooling'",
    "    debugImplementation 'androidx.compose.ui:ui-test-manifest'",
  );

  // Always use Retrofit for networking
  dependencies.push(
    "    implementation 'com.squareup.retrofit2:retrofit:2.9.0'",
    "    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'",
    "    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'",
  );

  // Always use Room for database
  dependencies.push(
    "    implementation 'androidx.room:room-runtime:2.6.1'",
    "    implementation 'androidx.room:room-ktx:2.6.1'",
    "    kapt 'androidx.room:room-compiler:2.6.1'",
  );

  // Always use Hilt for dependency injection
  dependencies.push(
    "    implementation 'com.google.dagger:hilt-android:2.48'",
    "    kapt 'com.google.dagger:hilt-android-compiler:2.48'",
  );

  // Always use Coil for image loading
  dependencies.push(
    "    implementation 'io.coil-kt:coil:2.5.0'",
    "    implementation 'io.coil-kt:coil-compose:2.5.0'",
  );

  // Always use Coroutines for async
  dependencies.push(
    "    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'",
  );


  // Testing dependencies
  dependencies.push(
    "    testImplementation 'junit:junit:4.13.2'",
    "    androidTestImplementation 'androidx.test.ext:junit:1.1.5'",
    "    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'",
  );

  // Determine if we need kapt
  const needsKapt = config.di === 'hilt' ||
                   config.database === 'room';

  // Format plugins
  let plugins = `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'`;

  if (needsKapt) {
    plugins += `
    id 'kotlin-kapt'`;
  }

  // Always add Hilt plugin
  plugins += `
    id 'com.google.dagger.hilt.android'`;

  plugins += `
}`;

  return `${plugins}

android {
    namespace '${config.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk ${config.minSdkVersion}
        targetSdk ${config.targetSdkVersion}
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary true
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = '17'
    }
    
    buildFeatures {
        compose true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.1'
    }
    
    packaging {
        resources {
            excludes += '/META-INF/{AL2.0,LGPL2.1}'
        }
    }
}

dependencies {
${dependencies.join('\n')}
}`;
}

function generateAndroidManifest(config: ProjectConfig): string {
  // Always include Hilt application class
  const applicationTag = `    <application
        android:name=".MyApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.${config.projectName.replace(/[^a-zA-Z0-9]/g, '')}"
        tools:targetApi="31">`;

  const notificationPermission = '';

  const internetPermission = config.networking !== 'none'
    ? `    <uses-permission android:name="android.permission.INTERNET" />\n`
    : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

${internetPermission}${notificationPermission}
${applicationTag}

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.${config.projectName.replace(/[^a-zA-Z0-9]/g, '')}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;
}

function generateMainActivityCompose(config: ProjectConfig): string {
  const themeName = config.projectName.replace(/[^a-zA-Z0-9]/g, '');

  return `package ${config.packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import ${config.packageName}.ui.theme.${themeName}Theme
${config.di === 'hilt' ? 'import dagger.hilt.android.AndroidEntryPoint\n' : ''}
${config.di === 'hilt' ? '@AndroidEntryPoint\n' : ''}class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ${themeName}Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = "Android",
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    ${themeName}Theme {
        Greeting("Android")
    }
}
`;
}


function generateHiltApplication(config: ProjectConfig): string {
  return `package ${config.packageName}

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Application initialization code here
    }
}`;
}

function addMvvmFiles(files: { path: string; content: string }[], config: ProjectConfig): void {
  // Add data model
  files.push({
    path: `app/src/main/java/${config.packageName.replace(/\./g, '/')}/data/model/Item.kt`,
    content: `package ${config.packageName}.data.model

data class Item(
    val id: String,
    val name: String,
    val description: String
)`,
  });

  // Add repository
  files.push({
    path: `app/src/main/java/${config.packageName.replace(/\./g, '/')}/data/repository/ItemRepository.kt`,
    content: `package ${config.packageName}.data.repository

import ${config.packageName}.data.model.Item
${config.di === 'hilt' ? 'import javax.inject.Inject\n' : ''}
${config.di === 'hilt' ? 'import javax.inject.Singleton\n\n@Singleton\n' : ''}class ItemRepository${config.di === 'hilt' ? ' @Inject constructor()' : ''} {
    
    fun getItems(): List<Item> {
        // In a real app, this would fetch data from a remote or local data source
        return listOf(
            Item("1", "First Item", "Description of first item"),
            Item("2", "Second Item", "Description of second item"),
            Item("3", "Third Item", "Description of third item")
        )
    }
}`,
  });

  // Add ViewModel
  files.push({
    path: `app/src/main/java/${config.packageName.replace(/\./g, '/')}/ui/viewmodel/MainViewModel.kt`,
    content: `package ${config.packageName}.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ${config.packageName}.data.model.Item
import ${config.packageName}.data.repository.ItemRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
${config.di === 'hilt' ? 'import javax.inject.Inject\n' : ''}
${config.di === 'hilt' ? 'import dagger.hilt.android.lifecycle.HiltViewModel\n\n@HiltViewModel\n' : ''}class MainViewModel${config.di === 'hilt' ? ' @Inject constructor(' : '('}
    ${config.di === 'hilt' ? '' : 'private '}val itemRepository: ItemRepository
) : ViewModel() {

    private val _items = MutableStateFlow<List<Item>>(emptyList())
    val items: StateFlow<List<Item>> = _items.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        loadItems()
    }

    private fun loadItems() {
        viewModelScope.launch {
            _isLoading.value = true
            // In a real app, this would be an async operation
            _items.value = itemRepository.getItems()
            _isLoading.value = false
        }
    }
}`,
  });
}




function generateColorKt(config: ProjectConfig): string {
  return `package ${config.packageName}.ui.theme

import androidx.compose.ui.graphics.Color

val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)`;
}

function generateTypeKt(config: ProjectConfig): string {
  return `package ${config.packageName}.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Set of Material typography styles to start with
val Typography = Typography(
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    )
    /* Other default text styles to override
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
    */
)`;
}

function generateThemeKt(config: ProjectConfig): string {
  const themeName = config.projectName.replace(/[^a-zA-Z0-9]/g, '');

  return `package ${config.packageName}.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Purple80,
    secondary = PurpleGrey80,
    tertiary = Pink80
)

private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40

    /* Other default colors to override
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
    */
)

@Composable
fun ${themeName}Theme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}`;
}

function generateReadme(config: ProjectConfig): string {
  const architectureDetails = {
    mvvm: 'Model-View-ViewModel (MVVM) architecture for separation of UI and business logic',
    clean: 'Clean Architecture with separate domain, data, and presentation layers',
    mvi: 'Model-View-Intent (MVI) with unidirectional data flow and immutable state',
    mvp: 'Model-View-Presenter (MVP) for separation of presentation logic from views',
    simple: 'Simple architecture for lightweight Android applications',
  };

  const libraryDetails = [];

  if (config.ui === 'compose') {
    libraryDetails.push('- Jetpack Compose for modern declarative UI');
  } else {
    libraryDetails.push('- XML-based layouts with ViewBinding');
  }

  if (config.networking !== 'none') {
    libraryDetails.push(`- ${config.networking === 'retrofit' ? 'Retrofit for type-safe HTTP requests' : 'Ktor Client for multiplatform HTTP networking'}`);
  }

  if (config.database !== 'none') {
    const dbDescriptions = {
      room: 'Room for SQLite database access with compile-time verification',
      realm: 'Realm for NoSQL object database',
      sqldelight: 'SQLDelight for typesafe SQL with multiplatform support',
    };
    libraryDetails.push(`- ${dbDescriptions[config.database as keyof typeof dbDescriptions]}`);
  }

  if (config.di !== 'none') {
    libraryDetails.push(`- ${config.di === 'hilt' ? 'Hilt for dependency injection' : 'Koin for lightweight dependency injection'}`);
  }

  if (config.imageLoading !== 'none') {
    libraryDetails.push(`- ${config.imageLoading === 'coil' ? 'Coil for image loading (Kotlin-first)' : 'Glide for efficient image loading'}`);
  }

  if (config.async !== 'none') {
    libraryDetails.push(`- ${config.async === 'coroutines' ? 'Kotlin Coroutines for asynchronous programming' : 'RxJava for reactive programming'}`);
  }


  return `# ${config.projectName}

Android application generated with AndroidProjectCraft.

## Project Specifications

- Package Name: \`${config.packageName}\`
- Minimum SDK Version: ${config.minSdkVersion}
- Target SDK Version: ${config.targetSdkVersion}
- ${architectureDetails[config.architecture]}
${config.useKotlinDsl ? '- Kotlin DSL for build scripts\n' : '- Groovy DSL for build scripts\n'}

## Libraries and Technologies

${libraryDetails.join('\n')}


## Getting Started

1. Open the project in Android Studio
2. Sync the Gradle files
3. Run the app on an emulator or device

## Requirements

- Android Studio Iguana (2023.2.1) or newer
- JDK 17 or newer

## License

This project is licensed under the MIT License - see the LICENSE file for details
`;
}