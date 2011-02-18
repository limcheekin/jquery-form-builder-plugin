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
package org.grails.jquery.formbuilder

/**
 *
 * @author <a href='mailto:limcheekin@vobject.com'>Lim Chee Kin</a>
 *
 * @since 0.1
 */
class JQueryFormBuilderTagLib {
	static namespace = "jqfb"
	def pluginManager
	
	def resources = { attrs, body ->
		String type = attrs.remove("type")
		def plugin = pluginManager.getGrailsPlugin('jqueryFormBuilder')
		def version = plugin.version
		def minified = grailsApplication.config.jqueryFormBuilder.get('minified', true)
		
		if (!type) {
			renderJavaScript g.resource(plugin:"jqueryFormBuilder", dir:"js", file:"jquery-formbuilder-${version}.${minified ? 'min.js' : 'js'}")
			renderCSS g.resource(plugin:"jqueryFormBuilder", dir:"css", file:"jquery-formbuilder-${version}.${minified ? 'min.css' : 'css'}")
		} else if (type.equals("js")) {
			renderJavaScript g.resource(plugin:"jqueryFormBuilder", dir:"js", file:"jquery-formbuilder-${version}.${minified ? 'min.js' : 'js'}")
		} else if (type.equals("css")) {
			renderCSS g.resource(plugin:"jqueryFormBuilder", dir:"css", file:"jquery-formbuilder-${version}.${minified ? 'min.css' : 'css'}")
		}
	}
	
	
	private renderJavaScript(def url) {
		out << '<script type="text/javascript" src="' + url + '"></script>\n'
	}
	
	private renderCSS(def url) {
		out << '<link rel="stylesheet" type="text/css" media="screen" href="' + url + '" />\n'
	}
}