import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'home',
  template: `
    <h1>Angular Bazel Example</h1>
    This is an example of building an Angular app at scale. It uses
    <code>BUILD.bazel</code>
    files to customize the configuration of Bazel. This means the application is compiled in many small libraries,
    giving us incremental builds. Read more about the example on the
    <a href="https://github.com/angular/angular-bazel-example">GitHub README</a>

    <h2>Navigating the example</h2>
    This application mimics a developer console for a cloud provider. There are ten sections in the left nav, which
    represent ten different teams that contribute their functionality to the single-page application. This is similar to
    how Google Cloud Console is developed with Bazel.
  `,
})
export class Home {}

@NgModule({
  declarations: [Home],
  imports: [RouterModule.forChild([{ path: '', component: Home }])],
})
export class HomeModule {}
