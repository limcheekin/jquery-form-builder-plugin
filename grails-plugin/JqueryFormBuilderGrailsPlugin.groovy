/* Copyright 2011 the original author or authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
*
* @author <a href='mailto:limcheekin@vobject.com'>Lim Chee Kin</a>
*
* @since 0.1
*/
class JqueryFormBuilderGrailsPlugin {
    // the plugin version
    def version = "0.1"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.2.2 > *"
    // the other plugins this plugin depends on
    def dependsOn = [jquery:'1.4.2.7', jqueryUi:'1.8.6']
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    def author = "Lim Chee Kin"
    def authorEmail = "limcheekin@vobject.com"
    def title = "JQuery Form Builder Plugin - JQuery WYSIWYG Web Form Builder"
    def description = '''\
The WYSIWYG Web Form Builder implemented in JQuery and JQuery UI allowed you 
to create online forms in web browser without any programming knowledge.
 
This plugin simply supplies [jQuery Form Builder plugin|http://code.google.com/p/jquery-form-builder-plugin/] resources, 
and depends on the jQuery plugin and jQuery UI plugin to include the supporting libraries.

Use this plugin in your own apps and plugins to avoid resource duplication and conflicts.

* Live Demo: [http://jquery-form-builder-plugin.appspot.com/]
* Project Site and Documentation: [http://code.google.com/p/jquery-form-builder-plugin/]
* Support: [http://code.google.com/p/jquery-form-builder-plugin/issues/list] 
* Discussion Forum: [http://groups.google.com/group/jquery-form-builder-plugin]
'''
    // URL to the plugin's documentation
    def documentation = "http://grails.org/plugin/jquery-form-builder"
}