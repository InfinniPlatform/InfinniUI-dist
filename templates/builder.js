function <%=_.capitalize(file.name)%>() {
}

_.inherit(<%=_.capitalize(file.name)%>, ElementBuilder);

_.extend(<%=_.capitalize(file.name)%>.prototype, {

        applyMetadata: function(params){
            ElementBuilder.prototype.applyMetadata.call(this, params);
            //TODO: сконфигурировать элемент из метаданных
        },

        createElement: function(params){
            var <%=file.name.replace("Builder","")%> = new <%=_.capitalize(file.name).replace("Builder","")%>(params.parent);

            return <%=file.name.replace("Builder","")%>;
        }

    }
);