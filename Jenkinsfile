#!/bin/groovy
@Library(["jpm_shared_lib@1.x"]) _                       // imports the latest stable version of JPM
import org.jnj.*
def args = [:]
args.debug = true                                        // set to true for verbose logs
args.cleanWorkspace = false                               // set to false to leave project directory intact after a build
args.manifestSourcesFile = 'manifest-sources.yaml'       // tells JPM where to find job configuration

new pipelines.stdPipeline().execute(args)                // invoke the JPM Standard Pipeline
