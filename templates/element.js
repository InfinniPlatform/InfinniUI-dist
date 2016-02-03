function <%=_.capitalize(file.name)%>(parentView) {
    _.superClass(<%=_.capitalize(file.name)%>, this, parentView);
}

_.inherit(<%=_.capitalize(file.name)%>, Element);

_.extend(<%=_.capitalize(file.name)%>.prototype, {

        createControl: function(){
            return new  <%=_.capitalize(file.name)%>Control();
        }

        //TODO: добавить API элемента
    }
);